/**
tplLoad(tpl,selector):加载模板到selector中
*/
LaolinApp.service('serviceCommon',["$http","$log",function ($http,$log) {
  var tplHtml=[];
  function tplFetch(tpl) {
    $log.log("fetchTpl");
    return $http.get(tpl).success(function(data){
      tplHtml[tpl]=data;
      $log.log("fetchTpl DONE.");
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
  }
  
}]);