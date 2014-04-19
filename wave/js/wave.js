LaolinApp.controller('waveListCtrl', 
    ["$scope", "$rootScope","$log","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,waveService,servicePlot,serviceCommon) {

  var DEF_VALUE={
    Tn:2.0,//单自由度时程分析的特征周期
    TnMaxSpec:5.99999,//反应谱分析的最大周期
    
    zita:0.05//阻尼比
  };
  function loadWave(name) {
    $scope.waveData=waveService.getWaveData(name);
    waveService.setCurrentWaveName($scope.waveName=name);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveObj);
    plotWave(name);
  }
  
  function plotWave(name) {
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
  }
  
  $scope.plotResponU=function() {
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.u ];
  }
  $scope.plotResponV=function() {
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.v ];
  }
  $scope.plotResponA=function() {
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.a ];
  }
  $scope.plotResponA2=function() {
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.a2 ];
  }
  $scope.delRespon=function() {
    delete $scope.waveObj[$scope.waveName].res;
    plotWave($scope.waveName);
  }
  
  
  $scope.waveResponAnalyse=function() {
    $log.log('waveResponAnalyse');
    waveService.newmark($scope.waveName);
    $scope.plotResponA2();
  }
  $rootScope.app.pageTitle="地震波列表";
  
  
  $scope.waves=waveService.getWaveList();
  if($scope.waves.length==0){
    waveService.fetchWaveList().then(function(data){
      $scope.waves=waveService.getWaveList();
    });
  }
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
        $scope.waveObj[name]['TnMaxSpec']=$scope.waveObj[name]['TnMaxSpec']||DEF_VALUE.TnMaxSpec;
        $log.log("Got data for waveName="+$scope.waveName);
      });
    }
  }
  
  
  // init data -------------
  $scope.waveObj=waveService.getWaveObj();
  $scope.waveName=waveService.getCurrentWaveName();
  $scope.waveData=waveService.getWaveData($scope.waveName)
  
  
  $scope.chartData = [[0]];
    
  $scope.chartOptions = {     
    title:'地震波', 
    axesDefaults:{pad:1.0},
    seriesDefaults: {
        shadow:false,
        rendererOptions: { smooth: false },
        lineWidth:1,
        markerOptions: { show:false }
    }      
  };
  $log.log("Current waveId is:"+$scope.waveId);
}]);

