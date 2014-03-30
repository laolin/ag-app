//copyright 2004 LaoLin
;
var waveApp = angular.module('waveApp', ['ui.bootstrap']);


waveApp.controller('waveCtrl', function ($scope) {
  //DEBUG标记，正式页面应设为false
  $scope.debug=false;
  //页面左上角，APP名称
  $scope.appName = "LaoLin地震波助手";
  //导航菜单项目
  $scope.navs=[
    {text:'首页',link:'#/index',active:false},
    {text:'主2',link:'#/m3',active:true},
    {text:'测试',link:'#/test2',active:false}
  ];
  
  //导航菜单最右侧可下拉的项目（可选）
  $scope.navdropdowns={text:"使用说明"};
  $scope.navdropdowns.items=[
    {text:'如何加载地震波',link:'#index1'},
    {text:'如何计算时程反应',link:'#/index2'},
    {text:'如何计算反应谱',link:'#/index3'},
    {class:"divider"},
    {text:'关于下载数据的格式',link:'#/index4'},
    {text:'如何下载Excel格式的地震波',link:'#/index5'},
    {text:'如何下载Excel格式的反应谱',link:'#/index6'},
    {text:'如何下载AutoCAD格式的地震波',link:'#/index7'},
    {text:'如何下载AutoCAD格式的反应谱',link:'#/index8'}
  ];
});
console.log("ng laolin wave app init.");

