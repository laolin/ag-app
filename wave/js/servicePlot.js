// 使用jqPlot
LaolinApp.service('servicePlot',["$http","$log",function ($http,$log) {
  
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