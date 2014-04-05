

    

LaolinApp.service('waveService', function () {
  var waveNameList=["wave1","wave2","Elcetro","SHW01x"];
  var waveData={"wave1":[1,2,1,3,4,5],"wave2":[21,22,21,23,24,25],
      "Elcetro":[31,32,31,33,34,35],"SHW01x":[41,442,4441,43,4444,4445],};
  var currentWaveId=-1;
  
  this.getWaveList = function () {
    return waveNameList;
  };
  this.getWaveData = function (id) {
    currentWaveId=id;
    return waveData[waveNameList[id]];
  };
  this.getCurrentWaveId = function() {
    return currentWaveId;
  };
  this.getCurrentWaveName = function() {
    return currentWaveId>=0?waveNameList[currentWaveId]:"";
  };
});

LaolinApp.controller('waveAnaCtrl', function ($scope, $rootScope,waveService) {
  $rootScope.app={pageTitle:"地震波列表"};

  
  $scope.waves=waveService.getWaveList();
  $scope.getWaveData=function(id){
    $scope.waveData=waveService.getWaveData(id)
    $scope.waveId=waveService.getCurrentWaveId();
  }
  $scope.waveId=waveService.getCurrentWaveId();
  $scope.waveData=waveService.getWaveData($scope.waveId)
  
});