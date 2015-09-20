// ---- SVG VARIABLES ---- //
var _svg = { "width": 1024, "height": 600, hpadding: 100, vpadding: 100 },
	_chart = { "width": (_svg.width - _svg.hpadding*3.5), "height": (_svg.height - _svg.vpadding*1.5), "bubble_width": 15, "sm_bubble_width": 4, "err-bar": 6 };

var _xscale = d3.scale.linear()
	//.domain([1990,2015])
	.range([0,0]);
var _yscale = d3.scale.linear()
	//.domain([0,1])
	.range([_chart.height,_chart.height]);

var _xaxis = d3.svg.axis()
    .scale(_xscale)
    .orient("bottom");
var _yaxis = d3.svg.axis()
    .scale(_yscale)
    .orient("left");

var _picker_series = { "width": _chart.width, "height": 50 };

var _main_transition = { "duration": 1000, "ease": "cubic-out", "fast_duration": 500, "very_fast_duration": 250, "null_duration": 0 };

var _play_interval;

var timeseries = d3.svg.line()
	//.interpolate("basis")
	.defined(function(d) { return d.x != "NA" && d.y !== "NA"; })
	.x(function(d){ return _xscale(d.x) })
	.y(function(d){ return _yscale(d.y) });

/*var area_variability = d3.svg.area()
	.defined(timeseries.defined())
	.x(timeseries.x())
	.y1(timeseries.y())
	.y0(y(0));*/