/**
tplLoad(tpl,selector):加载模板到selector中
*/
LaolinApp.service('serviceCommon',["$http","$log","$interval",
    function ($http,$log,$interval) {
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
  appConfig.CloseNotify=function() {
      delete appConfig.notify;
  }
  this.appNotify=function(text  ,delay,type) {
    if('undefined'==typeof(delay))delay=0;
    if('undefined'==typeof(type))type='success';
    if(delay>0)$interval(appConfig.CloseNotify,delay,1);
    return appConfig.notify={text:text,type:type};
  }
  //END: app config
  //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  
}]);