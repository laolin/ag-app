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
  var appConfig={notify:{}};
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
      //delete appConfig.notify;
      appConfig.notify={text:'Ready.',type:'info'}
  }
  this.appNotify=function(text  ,delay,type) {
    if('undefined'==typeof(delay))delay=0;
    if('undefined'==typeof(type))type='info';
    if(appConfig.notify.timer) {
      $interval.cancel(appConfig.notify.timer);
      appConfig.notify.timer=0;
    }
    if(delay>0){
      appConfig.notify.timer=$interval(appConfig.CloseNotify,delay,1);
    }
    appConfig.notify.text=text;
    appConfig.notify.type=type;
  }
  //END: app config
  //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  
  
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  /*BEGIN: JS 直接生成文件供浏览器下载  */
  
  //通过JS函数把一个数组变成 在浏览器里提示下载的文件
  function genFile(fname,array_obj){
  //see http://blogs.adobe.com/cantrell/archives/2012/01/how-to-download-data-as-a-file-from-javascript.html
  //a comment in the bottom of the page:
  //Micah Henning says:
  //August 3, 2012 at 12:28 am
    var a = document.createElement('a');
    var blob = new Blob(array_obj, {'type':'application/octet-stream'});
    a.href = window.URL.createObjectURL(blob);
    a.download = fname;
    a.click();
  }
  
  //（返回一个对象ret）
  //ret.xy: “x,y”格式的字符串数组
  //功能：
  //把一维数组(y)变成“x,y”格式的字符串数组
  //同时统计数组的最大值，最小值等信息
  function arrayToXyObj(array_y) {
    xy=[];
    ymin=Infinity;
    ymax=-Infinity;
    ymin_at=-1;
    ymax_at=-1;
    for(var i=0;i<array_y.length;i++){
      y=isNaN(array_y[i])?0:array_y[i];
      if(y>ymax){
        ymax=y;
        ymax_at=i;
      } else if(y<ymin){
        ymin=y;
        ymin_at=i;
      }
      xy.push(''+ i +","+ y +'\r\n');
    }
    xmin=0;
    xmax=i;
    return {xy:xy, min:ymin, min_at:ymin_at, max:ymax, max_at:ymax_at};
  }
  //功能1：
  //把一个js数组变成一个EXCEL的 *.csv文件
  //这些单元格的内容粘在ACAD命令行里执行，其结果是画出该数组的曲线
  //（以0,1,2...为X坐标，数组值为Y坐标）
  this.arrayToCsvFile=function (fname,array_y){
    data=[];
    xyo=arrayToXyo(array_y);  
    xy=xyo.xy;
    data[0]='length,min, min_at, max, max_at\r\n';
    data[1]=''+array_y.length+','+xyo.min+','+xyo.min_at+','+xyo.max+','+xyo.max_at+'\r\n';
    data=data.concat(xy);//Concatenating two arrays
    genFile(fname,data);
  }
   
  //功能2：
  //把一个js数组变成一个AutoCAD里可执行的 *.scr文件（扩展名非windows屏保重名，但完全没关系）
  //ACAD里执行的结果是画出数组的曲线
  //（以0,1,2...为X坐标，数组值为Y坐标）
  //（x,y坐标可分别放大sx,sy倍）
   this.arrayToACADPlineScrFile =function (fname,array_y,  sx,sy){
    if('undefined'==typeof(sx))sx=1;
    if('undefined'==typeof(sy))sy=1;
    data=[];
    xy=[];
    //data.push('textscr\r\n');//show text win
    data.push('OSMODE\r\n18607\r\n');//turn OFF osnap
    
    xyo=arrayToXyObj(array_y);  
    xy=xyo.xy;
    xmin=0;
    xmax=array_y.length;
    ymin=xyo.min;
    ymax=xyo.max;
    
    //rect=''+xmin+','+ymin+'\r\n'+xmax+','+ymax+'\r\n';
    //data.push('RECTANGLE\r\n'+rect);
    //data.push('zoom\r\n'+rect);
    
    //zoom window to fit the curve size
    sizeBox='@'+((xmax-xmin)*-sx)+','+((ymax-ymin)*-sy)+'\r\n'+
      '@'+((xmax-xmin)*3*sx)+','+((ymax-ymin)*3*sy)+'\r\n';
    data.push('zoom\r\n'+sizeBox);
    
    //draw curve at 0,0
    data.push("pline\r\n0,0\r\nw\r\n0\r\n0\r\n\r\npline\r\n");//set pline width=0
    data=data.concat(xy);//Concatenating two arrays
    data.push('\r\n');
    
    
    data.push('OSMODE\r\n2223\r\n');//turn ON osnap as my fav opt
    
    //convert the last pline to block
    blockName="Curve_"+fname+"_"+Date.now();
    data.push('_.-block\r\n'+blockName+'\r\n0,0\r\nL\r\n\r\n');
    
    //insert the block, set the x,y scale, wait user to pick ann insert point
    data.push('_.-INSERT\r\n'+blockName+'\r\nx\r\n'+sx+'\r\ny\r\n'+sy+'\r\nz\r\n'+sx+'\r\nr\r\n0\r\n');
    genFile(fname,data);
  }
  /* END: JS 直接生成文件供浏览器下载  */
  //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
}]);