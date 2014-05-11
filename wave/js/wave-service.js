/***
主要数据
  weveObj地震波对象，包含地震波列表，波数据，波计算结果等
    waveObj._$waveNameList 数组，地震波名字列表
    waveObj._$currentWaveName 当前波名
    waveObj['其他'] 一个成员表示一条地震波，包含数据，计算结果等。
    
内部函数:
  init
  _absMax(array) 返回数组各元数最大绝对值

外部服务：
  fetchWaveList 通过ajax下载地震波列表
  fetchWaveData(name) 通过ajax下载指定地震波数据
  
  getWaveObj 返回地震波对象，包含地震波列表，波数据，波计算结果等
  
  getWaveList 返回地震波列表
  getWaveData(name) 返回地震波数据
  getCurrentWaveName 返回波名
  
  setCurrentWaveName(name)
  
  setDataType(type) 设定要显示出来的数据：波数据或计算结果等。
  getDataByType(name)  根据显示的设定：返回波数据或计算结果数据等。
  
*/
LaolinApp.service('waveService', ["$http","$log","serviceCommon",
    function ($http,$log,serviceCommon) {
  var waveObj={};
  var console=$log;
  var apiScript,
    apiWave,
    apiWaveList;
  init();
  //内部函数：
  function init() {
    if('127.0.0.1'==document.location.host) {
      apiScript='../../a9/';
    } else {
      apiScript='http://api.laolin.com/v1.0/';
    }
    apiWave=apiScript+'?c=api&a=wave&js=JSON_CALLBACK&b=';
    apiWaveList=apiScript+'?c=api&a=wave&b=_list&js=JSON_CALLBACK';
    
    waveObj._$waveNameList=[];
    waveObj._$currentWaveName='';
    waveObj._$dataType='wave';//用于表示当前显示出波的什么数据，详见 getDataByType
  };
  function _absMax  ( ar ){
    mx=ar[0];
    for( var i=1; i<ar.length; i++) {
      if(Math.abs(ar[i])>mx)
        mx=Math.abs(ar[i]);
    }
    return mx;
  };
  
  
  //外部函数
  this.fetchWaveList = function() {
    serviceCommon.appNotify("正在获取地震波列表...",2000,'warning');
    return $http.jsonp(apiWaveList)  
      .success(function(data){
        waveObj._$waveNameList=data;
        serviceCommon.appNotify("获取地震波列表完成",2000,'success');
      })      
      .error(function () {
        serviceCommon.appNotify('获取地震波列表失败',0,'danger')
      });
  };
  //TODO: name不存在的情况
  this.fetchWaveData = function(name) {
    serviceCommon.appNotify("正在获取地震波数据...",2000,'warning');
    return $http.jsonp(apiWave+name)  
      .success(function(data){
        waveObj[name]=data;
        waveObj[name].absMax=_absMax(data.data);
        serviceCommon.appNotify("获取地震波数据完成",2000,'success');
      })      
      .error(function () {
        serviceCommon.appNotify('获取地震波数据失败',0,'danger')
      });
  };
  this.getWaveList = function () {
    return waveObj._$waveNameList;
  };
  this.getWaveObj = function () {
    return waveObj;
  };
  this.getWaveData = function (name) {
    return waveObj[name];
  };
  
  
  //TODO 这样是不行地，要看波名有效否，波数据在不在
  this.setCurrentWaveName = function(name) {
    return waveObj._$currentWaveName=name;
  };
  this.getCurrentWaveName = function() {
    return waveObj._$currentWaveName;
  };
  
  
  this.setDataType= function(type) {
    waveObj._$dataType=type;
  }
  //获取一条波对象中的数据数组：波数据、时程反应数据、反应谱数据等
  //type=['wave', 'resU','resV','resA','resA2', 'specU','specV','specA','specA2'];
  this.getDataByType=function(name) {
    type=waveObj._$dataType;
    var wave=waveObj[name];
    if(!wave){
      $log.log("no data for getDataByType: "+name);
      return false;
    }
    switch(type){
      case "wave":  dat=wave.data;   disc="波形数据";break;
      case "resU":  dat=wave.res.u;  disc="相对位移反应时程";break;
      case "resV":  dat=wave.res.v;  disc="相对速度反应时程";break;
      case "resA":  dat=wave.res.a;  disc="相对加速度反应时程";break;
      case "resA2": dat=wave.res.a2; disc="绝对加速度反应时程";break;
      case "specU": dat=wave.spec.u; disc="伪位移反应谱U";break;
      case "specV": dat=wave.spec.v; disc="伪速度反应谱V";break;
      case "specA": dat=wave.spec.a; disc="伪加速度反应谱A";break;
      case "specA2":dat=wave.spec.a2;disc="绝对加速度反应谱A2";break;
      default:$log.log("Error type for getDataByType: "+type);return false;
    }
    return {data:dat,disc:disc};
  }
  
  
  this.waveRespone = function(name) {
    var res=false;
    if(waveObj[name] && waveObj[name]['Tn']) {
      res=this.newmark(name,waveObj[name]['Tn']);
    }      
    if(res) {
      waveObj[name]['res']=res;
    }

  }
  this.newmark= function(name,Tn) {
    var obj=waveObj[name];
    if( !obj || !obj.data) {
      $log.log('newmark error:0: nodata');
      return false;
    }
    waveInput=obj.data;
    dt=obj.dt;
    //Tn=obj.Tn;去掉这个，改为可变参数，方便做反应谱分析
    zita=obj.zita;
    newMax=obj.newMax;
    res=_newmark(waveInput,dt,Tn,zita,  newMax);
    if(res.error) {
      $log.log('newmark error :1:'+res.error);
      return false;
    }
    //$log.log('newmark done.');
    return res;
  };

  
  
  
  
  
  
  
  
  ///newmark法计算单自由度的反应时程，参考乔普拉结构动力学中文版第二版
  ///waveInput:输入地震波数据
  ///dt:地震波数据点的时间间隔
  ///Tn:周期
  ///zita:阻尼比
  
  ///newMax:需要缩放后的绝对值峰值，默认、0或小于0就是不缩放(=1)
  ///stepCount:步数，默认全部
  ///stepStart：开始步号，默认从0开始
  function _newmark(waveInput,dt,Tn,zita,    newMax,stepCount,stepStart) {
    if(Tn<2*dt)
      return {error:'Need: Tn >= 2*dt.'};
    count=waveInput.length;//总步数
    wave=[];
    if(count<2)
      return {error:'wave data error.'};
    absMax=_absMax(waveInput);//原来的最大值
    if(absMax<0.000001)
      return {error:'wave data is all zero.'};
    if('undefined'==typeof(newMax)||newMax<=0)fac=1;
    else fac= Math.abs(newMax/absMax);
    waveInput.forEach(function(v,i){
      wave[i]=v*fac;
    });
    if('undefined'==typeof(stepCount)||stepCount<0)stepCount=count;
    if('undefined'==typeof(stepStart)||stepStart<0)stepStart=0;//从0步开始
    
    omega_n=2*3.14159265/Tn;  //公式 Eq.(2.1.5)
    
    gama=0.5;beta=0.25;  //平均加速度法
    //gama=0.5;beta=0.1666667;  //线性加速度法

    m=0.01;//随便，不影响结果！
    c=zita*2*m*omega_n;//阻尼系数c Eq.(2.2.2)
    k=m*omega_n*omega_n;//刚度公式 Eq.(2.1.4)
    U=[];
    V=[];// u的一阶导:v
    A=[];// u的二阶导:a
    A2=[];

    p0=0;
    U[0]=0;
    V[0]=0;
    //A[0]=0;
    A2[0]=0;

    //step 1.0 初始计算
    A[0]=(p0-c*V[0]-k*U[0])/m;
    
    K=k+(gama*c/beta/dt)+(m/beta/dt/dt);
    a=m/beta/dt+gama*c/beta;
    b=m/2/beta+dt*(gama/2/beta-1)*c;
    /*
    console.log('dt '+dt);
    console.log('Tn '+Tn);
    console.log('c '+c);
    console.log('count '+count);
    console.log('stepCount '+stepCount);
    console.log('stepStart '+stepStart);
    console.log('a '+a);
    console.log('b '+b);
    console.log('k '+k);
    console.log('K '+K);  //*/

    //console.log(wave);
    //step 2.0对每个时间步i进行计算
    for( i=0 ; /*i<count-1 && */i<stepCount-1; i++) { 
      //console.log(' ====  step : '+i);
      if(i+stepStart<count-1)
        dpi= -m*(wave[i+1+stepStart]-wave[i+stepStart]);  //Eq.(5.4.8)
      else
        dpi=0;//允许地震结束后再继续算后续的自由振动
      dPi=dpi+a*V[i]+b*A[i];  //step 2.1
      dui=dPi/K;  //step 2.2
      dVi=gama*dui/beta/dt-gama*V[i]/beta+dt*(1-gama/2/beta)*A[i];  //step 2.3
      dAi=dui/beta/dt/dt-V[i]/beta/dt-A[i]/2/beta;  //step 2.4
      
      /*
      console.log(',wv '+wave[i+stepStart]);
      console.log('dpi '+dpi);
      console.log('dPi '+dPi);
      console.log('dui '+dui);
      console.log('dVi '+dVi);
      console.log('dAi '+dAi); //*/
      U[i+1]=U[i]+dui;
      V[i+1]=V[i]+dVi;
      A[i+1]=A[i]+dAi;
      A2[i+1]=A[i+1]+wave[i+1+stepStart];
    }
    //console.log('wave');console.log(wave);
    //console.log('u');console.log(U);
    //console.log('v');console.log(V);
    //console.log('a');console.log(A);
    return {u:U,v:V,a:A,a2:A2,  
      maxU:_absMax(U),maxV:_absMax(V),maxA:_absMax(A),maxA2:_absMax(A2),
      Tn:Tn, zita:zita, fac:fac};//fac是比例系数
  
 };//end newmark()
}]);