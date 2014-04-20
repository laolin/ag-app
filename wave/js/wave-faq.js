//copyright 2004 LaoLin
;

//C.2 CarouselDemoCtrl controller
LaolinApp.controller('waveFaqCtrl',['$scope','serviceCommon',
    function ($scope,serviceCommon) {
  serviceCommon.appConfigSet('pageTitle','FAQ');

  $scope.myInterval = 5000;
  $scope.slides = getFaq();
  //style: LaolinApp.data.styles[slides.length%LaolinApp.data.styles.length],

  function getFaq() {
    var qa=[ //{q:'',a:''}, 
      {q:'欢迎使用',a:'欢迎使用LaoLin的地震波分析工具，如有任何意见或建议请发邮件 hi#laolin.com，laolin在此表示由衷的感谢。'},
      {q:'此App有什么功能？',a:'目前主要的功能是输入地震波数据，求其在指定特征周期的反应时程，以及其反应谱。'},
      {q:'为什么此编这个App？',a:'编写这个的起因为同事有一次需要转换一下地震波数据文件的格式。 然后由于我手头的电脑上都没有安装任何能在本地运行的编程软件，只好用做成网页APP放到我的网站上利来运行。当然现在这个App已经是完全重写过的并且增加了很多功能。'},
      {q:'什么叫反应谱？',a:'这个...一言难尽。'},
      {q:'什么是newmark法？',a:'一个叫newmark的人提出的计算方法。详见乔普拉《结构动力学》第2版。'}
    ];
    Math.random(Date.now());
    qa.forEach(function(v){
      v.style=LaolinApp.data.styles[Math.floor(Math.random()*LaolinApp.data.styles.length)];
    });
    return qa;
  }
}]);

