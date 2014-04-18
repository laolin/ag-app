LaolinApp.controller('waveListCtrl', 
    ["$scope", "$rootScope","$log","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,waveService,servicePlot,serviceCommon) {

  function loadWave(id) {
    $scope.waveData=waveService.getWaveData(id);
    waveService.setCurrentWaveId($scope.waveId=id);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveData);
    $log.log($scope.waveObj);
    plotWave(id);
  }
  
  function plotWave(id) {
    var dat=[];
    $scope.chartData=[];
    if(Array.isArray(id)) {
      id.forEach(function(i){
      dat=waveService.getWaveData(i).data;
      $scope.chartData.push(dat);
      });
    } else {
      dat=waveService.getWaveData(id).data;
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
  $scope.getWaveData=function(id){
    var data=waveService.getWaveData(id);
    if(data && data.data){ //已经加载过了
      loadWave(id);      
      $log.log("Reuse data for waveId="+$scope.waveId);
    }else{    //未加载，需要去加载数据
      $log.log("No data for waveId="+id);
      waveService.fetchWaveData(id).then(function(data){
        loadWave(id);      
        $log.log("Got data for waveId="+$scope.waveId);
      });
    }
  }
  
  
  // init data -------------
  $scope.waveId=waveService.getCurrentWaveId();
  $scope.waveName=waveService.getCurrentWaveName();
  $scope.waveData=waveService.getWaveData($scope.waveId)
  
  $scope.waveObj=waveService.getWaveObj();
  
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


LaolinApp.controller('waveDetCtrl', 
    ["$scope", "$rootScope","$log","$location","$interval","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,$location,$interval,waveService,servicePlot,serviceCommon) {
  $rootScope.app.pageTitle="地震波分析";
  $scope.waveId=waveService.getCurrentWaveId();
  if($scope.waveId<0) {
    $interval(function(){$location.path("/wave-list");},1000,1);
  }
  $scope.waveName=waveService.getCurrentWaveName();
  $scope.waveData=waveService.getWaveData($scope.waveId)
  servicePlot.loadChart("#box-chart1");
  serviceCommon.tplLoad("wave-det-panel.html","#box-panel");
  


}]);
