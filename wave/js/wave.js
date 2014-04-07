

    

LaolinApp.service('waveService', ["$http","$log",function ($http,$log) {
  var waveNameList=[];
  var waveData={};
  var currentWaveId=-1;
  
  var apiScript,
    apiWave,
    apiWaveList;
  function init() {
    if('127.0.0.1'==document.location.host) {
      apiScript='../../a9/';
    } else {
      apiScript='http://api.laolin.com/v1.0/';
    }
    apiWave=apiScript+'?c=api&a=wave&js=JSON_CALLBACK&b=';
    apiWaveList=apiScript+'?c=api&a=wave&b=_list&js=JSON_CALLBACK';
  };
  init();
  
  this.fetchWaveList = function() {
    $log.log("fetchWaveList start");
    return $http.jsonp(apiWaveList)  
      .success(function(data){
        waveNameList=data;
        $log.log("fetchWaveList success");
      })      
      .error(function () {
        console.log('fetchWaveList error')
      });
  };
  this.fetchWaveData = function(id) {
    $log.log("fetchWaveData start");
    return $http.jsonp(apiWave+waveNameList[id])  
      .success(function(data){
        waveData[waveNameList[id]]=data;
        $log.log("fetchWaveData success");
      })      
      .error(function () {
        console.log('fetchWaveData error')
      });
  };
  this.getWaveList = function () {
    return waveNameList;
  };
  this.getWaveData = function (id) {
    return waveData[waveNameList[id]];
  };
  
  
  this.getCurrentWaveId = function() {
    return currentWaveId;
  };
  this.setCurrentWaveId = function(id) {
    return currentWaveId=id;
  };
  this.getCurrentWaveName = function() {
    return currentWaveId>=0?waveNameList[currentWaveId]:"";
  };
}]);

LaolinApp.controller('waveListCtrl', 
    ["$scope", "$rootScope","$log","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,waveService,servicePlot,serviceCommon) {

  function loadWave(id) {
    $scope.waveData=waveService.getWaveData(id);
    waveService.setCurrentWaveId($scope.waveId=id);
    $scope.waveName=waveService.getCurrentWaveName();
    $log.log($scope.waveData);
  }
  $rootScope.app.pageTitle="地震波列表";
  
  serviceCommon.tplLoad("comm-plot-area.html","#box-chart1");
  serviceCommon.tplLoad("wave-det-panel.html","#box-panel");
  
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
  $scope.waveId=waveService.getCurrentWaveId();
  $scope.waveName=waveService.getCurrentWaveName();
  $scope.waveData=waveService.getWaveData($scope.waveId)
  
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
