LaolinApp.controller('waveListCtrl', 
    ["$scope", "$rootScope","$log","waveService","servicePlot","serviceCommon",
    function ($scope, $rootScope,$log,waveService,servicePlot,serviceCommon) {

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
    plotWave(name);
  }
  
  function plotWave(name) {
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
  }
  
  $scope.plotResponU=function() {
    $scope.plotType='相对位移反应时程';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.u ];
  }
  $scope.plotResponV=function() {
    $scope.plotType='相对速度反应时程';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.v ];
  }
  $scope.plotResponA=function() {
    $scope.plotType='相对加速度反应时程';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.a ];
  }
  $scope.plotResponA2=function() {
    $scope.plotType='绝对加速度反应时程';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].res.a2 ];
  }
  
  $scope.plotSpecU=function() {
    $scope.plotType='伪位移反应谱:U';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].spec.u ];
  }
  $scope.plotSpecV=function() {
    $scope.plotType='伪速度反应谱:V';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].spec.v ];
  }
  $scope.plotSpecA=function() {
    $scope.plotType='伪加速度反应谱:A';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].spec.a ];
  }
  $scope.plotSpecA2=function() {
    $scope.plotType='绝对加速度反应谱:A2';
    $scope.chartData=[ $scope.waveObj[$scope.waveName].spec.a2 ];
  }
  
  $scope.delResult=function() {
    delete $scope.waveObj[$scope.waveName].res;
    delete $scope.waveObj[$scope.waveName].spec;
    plotWave($scope.waveName);
  }
  
  
  
  
  $scope.waveAnalyse=function() {
    $scope.waveResponAnalyse();
    $scope.waveSpectrumAnalyse();
    $scope.plotSpecA2();
  }
  $scope.waveResponAnalyse=function() {
    waveService.waveRespone($scope.waveName);
  }
  $scope.waveSpectrumAnalyse=function() {
    var obj=$scope.waveObj[$scope.waveName]
    var spec={u:new Array(len),v:new Array(len),a:new Array(len),a2:new Array(len)};
    spec.dtn=DEF_VALUE.TnSpecDelta;
    var len=Math.ceil(obj.TnSpecMax/spec.dtn);
    for(kk=1;  kk< len;  kk++) {
      tn=kk*spec.dtn;
      if(tn<2*dt)continue;
      //console.log('tn='+tn);
      rs=waveService.newmark($scope.waveName,tn);
      
      spec.u[kk]=rs.maxU;
      spec.v[kk]=rs.maxV;
      spec.a[kk]=rs.maxA;
      spec.a2[kk]=rs.maxA2;
    }
    obj['spec']=spec;

    
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
        $scope.waveObj[name]['TnSpecMax']=$scope.waveObj[name]['TnSpecMax']||DEF_VALUE.TnSpecMax;
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
    title:'', 
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

