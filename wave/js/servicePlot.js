// 使用jqPlot
LaolinApp.service('servicePlot',["$http","$log",function ($http,$log) {
  var chartTpl="comm-plot-area.html";
  var chartHtml="";
  function fetchChart() {
    $log.log("fetchChart");
    return $http.get(chartTpl).success(function(data){
      chartHtml=data;
      $log.log("fetchChart DONE.");
    })
  }
  this.loadChart=function(selc) {
    if(chartHtml) {
      $log.log("reuse chart");
      $(selc).html(chartHtml);
    } else {
      fetchChart().then(function(data){
        $(selc).html(chartHtml);
      });
    }
  }
  
  ///TODO: 支持多条曲线
  this.plotData=function(d,label){
    $("#chart1").html('');
    $("#chart1-label").html(label);
    
    $.jqplot ('chart1', [d],
        { seriesDefaults:{shadow:false,lineWidth:1,showMarker:false},//label:label,
          axesDefaults:{pad:1.0},
          legend:{show:false,location:'se'}
        }
      );
  }
}]);