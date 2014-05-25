LaolinApp.controller('waveListCtrl', 
    ["$scope","$log","waveService","serviceCommon",
    function ($scope,$log,waveService,serviceCommon) {

  var DEF_VALUE={
    Tn:2.0,//单自由度时程分析的特征周期
    TnSpecMax:5.99999,//反应谱分析的最大周期
    TnSpecDelta:0.01,//反应谱分析的周期间隔
    
    zita:0.05//阻尼比
  };
  
  function loadWave(name) {
    $scope.waveData=waveService.getWaveData(name);
    waveService.setCurrentWaveName($scope.waveName=name);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveObj);
    $scope.plotWaveData();
  }
  
  function _plotData(title,dataArr,tArr) {
    $scope.chartOptions.series=[];
    if(Array.isArray(title)) {
      title.forEach(function(t){
        $scope.chartOptions.series.push({label:t});
      });
    
      $scope.chartOptions.title='反应谱对比';
    } else {
      $scope.chartOptions.series=[{label:$scope.waveName}];
      $scope.chartOptions.title=title;
    }
    $scope.chartData=dataArr;
    
  }
  //--------------
  $scope.plotWaveData=function(type) {
    if('undefined'!==typeof(type)) {
      waveService.setDataType(type);
    }
    o=waveService.getDataByType($scope.waveName);
    $scope.plotType= waveService.getDataType();
    
    if(!o){
      serviceCommon.appNotify('请点击地震波加载数据',0);
      return _plotData('无数据',[[0]]);
    }
    serviceCommon.appNotify('显示【'+$scope.waveName+'】的'+o.disc,-4000);
    if(o.type=='compare') {
      $log.log(o);
      _plotData(o.disc,o.data);
    } else {
      _plotData(o.disc,[o.data]);
    }
  }
  
  $scope.delResult=function() {
    delete $scope.waveObj[$scope.waveName].res;
    delete $scope.waveObj[$scope.waveName].spec;
    $scope.plotWaveData('wave');
  }
  
  
  
  
  $scope.waveAnalyse=function() {
    //serviceCommon.appNotify("waveAnalyse start",0,'warning');
    $scope.waveResponAnalyse();
    $scope.waveSpectrumAnalyse();
    $scope.plotWaveData("specA2");
    //serviceCommon.appNotify("waveAnalyse done",-500,'success');
  }
  $scope.waveResponAnalyse=function() {
    waveService.waveRespone($scope.waveName);
  }
  $scope.waveSpectrumAnalyse=function() {
    var obj=$scope.waveObj[$scope.waveName]
    var spec={u:new Array(len),v:new Array(len),a:new Array(len),a2:new Array(len)};
    spec.dtn=DEF_VALUE.TnSpecDelta;
    var len=Math.ceil(obj.TnSpecMax/spec.dtn);
    for(kk=0;  kk< len;  kk++) {
      tn=kk*spec.dtn;
      if(tn<2*dt) {
        rs={maxU:0,maxV:0,maxA:0,maxA2:0};//避免undefined, NAN数据
      } else {
      //console.log('tn='+tn);
        rs=waveService.newmark($scope.waveName,tn);
      }
      spec.u[kk]=rs.maxU;
      spec.v[kk]=rs.maxV;
      spec.a[kk]=rs.maxA;
      spec.a2[kk]=rs.maxA2;
    }
    obj['spec']=spec;

    
  }
  
  serviceCommon.appConfigSet('pageTitle','地震波分析');
  
  
  $scope.getWaveData=function(name){
    var data=waveService.getWaveData(name);
    if(data && data.data){ //已经加载过了
      loadWave(name);      
      $log.log("Reuse data for waveName="+$scope.waveName);
    }else{    //未加载，需要去加载数据
      $log.log("No data for waveName="+name);
      waveService.fetchWaveData(name).then(function(data){
        waveService.setDataType('wave');
        loadWave(name);   
        $scope.waveObj[name]['newMax']=$scope.waveObj[name]['newMax']||$scope.waveObj[name]['absMax']

        $scope.waveObj[name]['Tn']=$scope.waveObj[name]['Tn']||DEF_VALUE.Tn;
        $scope.waveObj[name]['zita']=$scope.waveObj[name]['zita']||DEF_VALUE.zita;
        $scope.waveObj[name]['TnSpecMax']=$scope.waveObj[name]['TnSpecMax']||DEF_VALUE.TnSpecMax;
        $log.log("Got data for waveName="+$scope.waveName);
      });
    }
  };
  $scope.searchWaveType=0;//0:all, 1:loaded, 2:analysed
  $scope.setSearchWaveType= function (n) {
    $scope.searchWaveType=n;
    //$log.log('searchWaveType='+n);
  }
  $scope.getWaveTypeSearched= function (n) {
    //统计波条数信息：
    //[0]=共有多少条波
    //[1]=共有多少条波已加载
    //[2]=共有多少条波已计算
    if(n==0)return $scope.waves.length;
    if(n!=1 && n!=2)return 0;
    a=0;
    $scope.waves.forEach(function(name) {
      a+= n==1 ?
      ($scope.waveObj[name]&&$scope.waveObj[name].data?1:0) :
      ($scope.waveObj[name]&&$scope.waveObj[name].res?1:0);
    })
    return a;
  }
    
  $scope.listWaveFilter= function (act){
    if($scope.searchWaveType==1 && !$scope.waveObj[act])return false;
    if($scope.searchWaveType==2 && (!$scope.waveObj[act] || !$scope.waveObj[act]['res']) )return false;
    return true;
   }
  
  
  // init data -------------
  $scope.waves=waveService.getWaveList();
  if($scope.waves.length==0){
    waveService.fetchWaveList().then(function(data){
      $scope.waves=waveService.getWaveList();
    });
  }
  $scope.waveObj=waveService.getWaveObj();
  $scope.waveName=waveService.getCurrentWaveName();
  $scope.plotType=waveService.getDataType();
  $scope.chartOptions = {     
    title:"welcome to Laolin Wave Tools", 
    axesDefaults:{pad:1.0},
    legend:{show: true,location:'ne',placement :"inside"},
    seriesDefaults: {
        shadow:false,
        rendererOptions: { smooth: false },
        lineWidth:1,
        markerOptions: { show:false }
    }      
  };
  //$scope.plotWaveData();//由于在tab的select里会调用 plotWaveData ，所以不要重复调用了。

  
  
  
  
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  //BEGIN: 导出文件功能
  ///把xx地震波的绝对加速度反应谱下载为scr文件
  //type: wave, resU,resV,resA,resA2, specU,specV,specA,specA2
  $scope.dataToCsv=function() {
    dataToFile('csv');
  }
  $scope.dataToScr=function() {
    dataToFile('scr');
  }
  function dataToFile(type,fn) {
    o=waveService.getDataByType($scope.waveName);
    if(!o){      
      serviceCommon.appNotify("无法下载数据",6000,'warning');
      return false;
    }
    max = Math.max(Math.max.apply(null, o.data),
     -Math.min.apply(null, o.data))
    if(max<1e-6)return false;
    sy=+(o.data.length/max/2).toPrecision(1);
    //将就先用一下： waveObj._$dataType，以后要去掉对_$xx对象的直接使用。
    
    if(type=='scr') {
      fn=serviceCommon.arrayToACADPlineScrFile;
      serviceCommon.appNotify("开始下载为 AutoCAD .scr文件。【注意：Y向已缩放"+sy+"倍】",6000,'success');
    } else /*if(type=='csv')*/ {
      fn=serviceCommon.arrayToCsvFile;
      serviceCommon.appNotify("开始下载为 Excel .csv文件。",6000,'success');
    }
    fn($scope.waveName+"_"+$scope.waveObj._$dataType+'_sy_'+sy+'.'+type,o.data,1,sy)
  } 
   
  ///把多条地震波的绝对加速度反应谱 的 平均值 下载为scr文件
  /* 用法示例：
  a2AverageScr([
  'SHW1-AWX0.9-1.txt',
  'SHW2-AWX0.9-2.txt',
  'SHW3-NRX0.9-3.txt',
  'SHW4-NRX0.9-4.txt',
  'SHW5-NRX0.9-5.txt',
  'SHW6-NRX0.9-6.txt',
  'SHW7-NRX0.9-7.txt'
  ],'SHW1x~7x.avg');
  * /
  function a2AverageScr(arrays,fname){
    an=arrays.length;
    a2s=[];
    for(var a=0;a<an;a++){
      a2s.push(waveData[arrays[a]].spec.a2);
    }
    av=arraysAverage(a2s);
    arrayToPlineAutoCADScrFile(fname+'.scr',av,1,1);
  }
   
   
  ///以下两个函数用于求平均反应谱
  ///对多个数组，各个元素各自求和形成新数组
  ///@para: fact :放大系数
  function arraysSum(arrays,fact){
    an=arrays.length;
    n=arrays[0].length;
    s=new Array(n);
    for(var i=0;i<n;i++){
      sum=0;
      for(var a=0;a<an;a++){
        if(isFinite(arrays[a][i])){
          sum=sum+parseFloat(arrays[a][i]);
        }
      }
      s[i]=sum*fact;
    }
    return s;
  } 
  ///对多个数组，各个元素各自求平均值形成新数组
  function arraysAverage(arrays){
    return arraysSum(arrays,1/arrays.length);
  } 
  */
  //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  //END: 导出文件功能
  
}]);

