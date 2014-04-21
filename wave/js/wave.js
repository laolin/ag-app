LaolinApp.controller('waveListCtrl', 
    ["$scope","$log","waveService","serviceCommon",
    function ($scope,$log,waveService,serviceCommon) {

  var DEF_VALUE={
    Tn:2.0,//单自由度时程分析的特征周期
    TnSpecMax:5.99999,//反应谱分析的最大周期
    TnSpecDelta:0.01,//反应谱分析的周期间隔
    
    zita:0.05//阻尼比
  };
  
  var dataName=[];
  function loadWave(name) {
    $scope.waveData=waveService.getWaveData(name);
    waveService.setCurrentWaveName($scope.waveName=name);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveObj);
    $scope.plotData('wave');
    serviceCommon.appNotify("Current wave: "+$scope.waveName,5000);
  }
  /*function plotWave(name) {
    $scope.plotType='波形图';
    var dat=[];
    $scope.chartData=[];
    if(Array.isArray(name)) {
      name.forEach(function(i){
      dat=waveService.getWaveData(i).data;
      $scope.chartData.push(dat);
      });
    } else {
      dat=waveService.getWaveData(name).data;
      $scope.chartData.push(dat);
    }
  }*/
  
  //--------------
  $scope.plotData=function(type) {
    if('undefined'!==typeof(type)) {
      waveService.setDataType(type);
    }
    o=waveService.getDataByType($scope.waveName);
    if(!o){
      o={disc:'无数据',data:[0]};
    }
    $scope.plotType=o.disc;
    $scope.chartData=[ o.data ];
  }
  
  $scope.delResult=function() {
    delete $scope.waveObj[$scope.waveName].res;
    delete $scope.waveObj[$scope.waveName].spec;
    $scope.plotData('wave');
  }
  
  
  
  
  $scope.waveAnalyse=function() {
    serviceCommon.appNotify("waveAnalyse start",0,'warning');
    $scope.waveResponAnalyse();
    $scope.waveSpectrumAnalyse();
    $scope.plotData("specA2");
    serviceCommon.appNotify("waveAnalyse done",500,'success');
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
        
        loadWave(name);   
        $scope.waveObj[name]['newMax']=$scope.waveObj[name]['newMax']||$scope.waveObj[name]['absMax']

        $scope.waveObj[name]['Tn']=$scope.waveObj[name]['Tn']||DEF_VALUE.Tn;
        $scope.waveObj[name]['zita']=$scope.waveObj[name]['zita']||DEF_VALUE.zita;
        $scope.waveObj[name]['TnSpecMax']=$scope.waveObj[name]['TnSpecMax']||DEF_VALUE.TnSpecMax;
        $log.log("Got data for waveName="+$scope.waveName);
      });
    }
  };
  
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  //BEGIN: 导出文件功能
  ///把xx地震波的绝对加速度反应谱下载为scr文件
  //type: wave, resU,resV,resA,resA2, specU,specV,specA,specA2
  $scope.dataToScr=function() {
    o=waveService.getDataByType($scope.waveName);
    
    if(!o){      
      serviceCommon.appNotify("无法下载数据",0,'warning');
      return false;
    }
    max = Math.max(Math.max.apply(null, o.data),
     -Math.min.apply(null, o.data))
    if(max<1e-6)return false;
    sy=+(o.data.length/max/2).toPrecision(1);
    //将就先用一下： waveObj._$dataType，以后要去掉对_$xx对象的直接使用。
    serviceCommon.appNotify("开始下载的AutoCAD .scr文件。【注意：Y向已缩放"+sy+"倍】",0,'success');
    serviceCommon.arrayToACADPlineScrFile($scope.waveName+"_"+$scope.waveObj._$dataType+'_sy_'+sy+'.scr',o.data,1,sy)
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
  
  $scope.chartOptions = {     
    title:'', 
    axesDefaults:{pad:1.0},
    seriesDefaults: {
        shadow:false,
        rendererOptions: { smooth: false },
        lineWidth:1,
        markerOptions: { show:false }
    }      
  };
  $scope.plotData();

  serviceCommon.appNotify("Current wave: "+$scope.waveName,5000);
}]);

