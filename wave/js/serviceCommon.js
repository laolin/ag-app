/**
tplLoad(tpl,selector):加载模板到selector中
*/
LaolinApp.service('serviceCommon',["$http","$log",function ($http,$log) {
  var tplHtml=[];
  function tplFetch(tpl) {
    $log.log("fetchTpl START: "+tpl);
    return $http.get(tpl).success(function(data){
      tplHtml[tpl]=data;
      $log.log("fetchTpl DONE: "+tpl);
    })
  }
  this.tplLoad=function(tpl,selector) {
    if(tplHtml[tpl]) {
      $log.log("reuse tpl:"+tpl);
      $(selector).html(tplHtml[tpl]);
    } else {
      tplFetch(tpl).then(function(data){
        $(selector).html(tplHtml[tpl]);
      });
    }
  };;
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  //BEGIN: app config
  var appConfig={};
  this.appConfigObj=function() {
    return appConfig;
  }
  this.appConfigGet=function(k) {
    return appConfig[k];
  }
  this.appConfigSet=function(k,v) {
    return appConfig[k]=v;
  }
  //END: app config
  //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  
}]);