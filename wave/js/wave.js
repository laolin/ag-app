LaolinApp.controller('waveListCtrl', 
    ["$scope", "$rootScope","$log","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,waveService,servicePlot,serviceCommon) {

  function loadWave(name) {
    $scope.waveData=waveService.getWaveData(name);
    waveService.setCurrentWaveName($scope.waveName=name);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveData);
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
  $rootScope.app.pageTitle="地震波列表";
  
  serviceCommon.tplLoad("wave-list-panel.html","#box-panel");
  
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

