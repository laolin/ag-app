//copyright 2004 LaoLin
;
var LaolinApp = angular.module('LaolinApp', ['ui.bootstrap']);

//A.1 通用数据
LaolinApp.data={};
LaolinApp.data.styles=['blue','green','red','yellow',
  'orange','pink','purple','lime','magenta','teal'];//,'white','black'


//C.0 AppCtrl controller
LaolinApp.controller('AppCtrl', function ($scope) {
  //DEBUG标记，正式页面应设为false
  $scope.debug=false;
});

//C.1 TopNavCtrl controller
LaolinApp.controller("TopNavCtrl", function ($scope) {

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
    {text:'关于下载数据',class:'dropdown-header'},
    {text:'关于下载数据的格式',link:'#/index4'},
    {text:'如何下载Excel格式的地震波',link:'#/index5'},
    {text:'如何下载Excel格式的反应谱',link:'#/index6'},
    {text:'如何下载AutoCAD格式的地震波',link:'#/index7'},
    {text:'如何下载AutoCAD格式的反应谱',link:'#/index8'}
  ];
});

//C.3 MarketingCtrl controller
LaolinApp.controller("MarketingCtrl", function ($scope) {
  var row1=[
    {width:4,imgSize:200,link:'#/about',img:'http://files.laolin.com/2013/structural-engineering/linjp-2012.9.3-180x180.jpg',title:'个人简历',text:'林建萍，高级工程师，国家一级注册结构工程师'},
    {width:4,imgSize:200,link:'#/about',img:'http://files.laolin.com/2013/development/20130715-development.jpg',title:'老林编程',text:'编程是老林的业余爱好。'},
    {width:4,imgSize:200,link:'#/about',img:'http://files.laolin.com/2013/laolin-family/20130525.laolin.family-200.jpg',title:'我爱我家',text:'欢欢喜喜龙凤胎、Anyi和老林。'}
   ];
  var row2=[
    {width:3,imgSize:150,link:'#/about',img:'http://files.laolin.com/2013/structural-engineering/21030715-structural.jpg',title:'Title -2-1-1',text:'test text 1 11 测试'},
    {width:3,imgSize:150,link:'#/about',img:'http://files.laolin.com/2013/structural-engineering/20130715-team.jpg',title:'Title -3-2-1',text:'test text 222222222222 测试'},
    {width:3,imgSize:150,link:'#/about',img:'http://files.laolin.com/2013/laolin-family/20130525.laolin.family-200.jpg',title:'Title -3-3-1',text:'3333333333test text 1 11 测试'},
    {width:3,imgSize:150,link:'#/about',img:'http://files.laolin.com/2013/structural-engineering/linjp-2012.9.3-180x180.jpg',title:'Ti4444444tle -2-4-1',text:'444444444test 测试text 测试 33333 测试'}
   ];
  $scope.rows=[row1,row2];
});


//C.2 CarouselDemoCtrl controller
LaolinApp.controller('CarouselDemoCtrl',function ($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    slides.push({
      style: LaolinApp.data.styles[slides.length%LaolinApp.data.styles.length],
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes',"Dog"][slides.length % 5]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
});



console.log("ng laolin wave app init.");

