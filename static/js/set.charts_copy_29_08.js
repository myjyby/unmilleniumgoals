function set_svg(){
	return d3.select("#container")
		.append("svg")
		.attr("width",_svg.width)
		.attr("height",_svg.height)
	.append("g")
		.attr("id","canvas")
		.attr("transform","translate(" + [_svg.hpadding,_svg.vpadding/2] + ")");
}

function set_axes(){
	var svg = d3.select("#canvas");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + _chart.height + ")")
		.call(_xaxis)
	.append("foreignObject")
		.attr("width",_chart.width)
		.attr("height",_svg.vpadding)
		.on("click",function(){
			d3.event.stopPropagation();
			d3.select(this).select("button").classed("active",true);
			if(_play_interval !== undefined){ 
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval); 
			}
			return set_picker_series("abscisse");
		})
	.append("xhtml:body")
		.attr("class","fo-body axis-label")
	.append("button")
		.attr("class","x-label")
		.html("X Axis&nbsp;&#65514;");

	d3.select(".x.axis")
		.select(".domain")
		.attr("stroke-dasharray","5,5");

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0," + 0 + ")")
		.call(_yaxis)
	.append("foreignObject")
		.attr("width",_chart.height)
		.attr("height",_svg.hpadding)
		.attr("transform", "translate(" + [-_svg.hpadding,_svg.height - _svg.vpadding*1.5] + ") rotate(-90)")
		.on("click",function(){
			d3.event.stopPropagation();
			d3.select(this).select("button").classed("active",true);
			if(_play_interval !== undefined){
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval); 
			}
			return set_picker_series("ordonnees");
		})
	.append("xhtml:body")
		.attr("class","fo-body axis-label")
	.append("button")
		.attr("class","y-label")
		.html("Y Axis&nbsp;&#65516;");

	d3.select(".y.axis")
		.selectAll(".tick")
		.attr("stroke-dasharray","5,5");
	return;
}

function update_axes(x_label,x_series,y_label,y_series){
	d3.select(".x.axis")
		.transition()
		.duration(_main_transition.fast_duration)
		.ease(_main_transition.ease)
		.call(_xaxis)
		.each("end",function(){
			d3.select(".x.axis")
				.selectAll(".tick")
				.select("line")
				.transition()
				.duration(_main_transition.fast_duration)
				.ease(_main_transition.ease)
				.attr("y2",-_yscale.range()[0]);
		})

	d3.select(".x-label")
		.datum(x_series)
		.html(x_label + "&nbsp;&#65514;");

	d3.select(".y.axis")
		.transition()
		.duration(_main_transition.fast_duration)
		.ease(_main_transition.ease)
		.call(_yaxis)
		.each("end",function(){
			d3.select(".y.axis")
				.selectAll(".tick")
				.select("line")
				.attr("stroke-dasharray","5,5")
				.transition()
				.duration(_main_transition.fast_duration)
				.ease(_main_transition.ease)
				.attr("x2",_xscale.range()[1]);
		});

	d3.select(".y-label")
		.datum(y_series)
		.html(y_label + "&nbsp;&#65516;");
	return;
}

function set_bubbles(x_series,y_series,date,slider,zoom){

	var _svg = d3.select("#canvas");

	return $.post("/retrieveseries", 
		$.param({ "subset_key": "SeriesRowId", "subset_x_value": x_series, "subset_y_value": y_series }, true)
	)
	.done(function(data){

		var series_x = new Array(),
			series_y = new Array();
		data.forEach(function(d){
			if(d.SeriesRowId === x_series){
				return series_x.push({ "name": d.SeriesName, "code": d.SeriesRowId });
			}else if(d.SeriesRowId === y_series){
				return series_y.push({ "name": d.SeriesName, "code": d.SeriesRowId });
			}
		});

		series_x = series_x[0];
		series_y = series_y[0];

		data = d3.nest()
			.key(function(d){ return d.CountryName; })
			.entries(data);

		var map = data.map(function(d){
			var x_values = new Array(25),
				y_values = new Array(25),
				country_id, region;

			for(var j=0; j<26; j++){
				x_values[j] = 0;
				y_values[j] = 0;
			}
			
			d.values.map(function(c){
				country_id = c.CountryId;
				region = c.Region;
				if(c.SeriesRowId === x_series){
					x_values[+c.Year-1990] = c.Value
				}else if(c.SeriesRowId === y_series){
					y_values[+c.Year-1990] = c.Value
				}
			});
			return { "x": x_values, "y": y_values, "country": d.key, "countryid": country_id, "region": region };
		});

		var countries = map.map(function(d){ 
			return  { "country": d.country, "countryid": d.countryid, "region": d.region };
		});

		if(!d3.select(".country-picker-menu")[0][0]){
			set_countrymenu(countries);
		}
		var zoom = determine_zoom();

		if(zoom){
			var x_scaledata = map.map(function(d){
				if(d.y[+date-1990] > 0){
					return d.x[+date-1990];
				}else{
					return 0;
				}
			});
			var y_scaledata = map.map(function(d){
				if(d.x[+date-1990] > 0){
					return d.y[+date-1990];
				}else{
					return 0;
				}
			});
			x_scaledata = x_scaledata.filter(function(d){
				return d > 0;
			});
			y_scaledata = y_scaledata.filter(function(d){
				return d > 0;
			});
		}else{
			var x_scaledata = map.map(function(d){
				return d.x.filter(function(c,i){ 
						return c >= 0;
					})
			});
			var y_scaledata = map.map(function(d){
				return d.y.filter(function(c,i){ 
						return c >= 0;
					})
			});
		}
		var m_x = new Array(),
			m_y = new Array();
		m_x = m_x.concat.apply(m_x,x_scaledata);
		m_y = m_y.concat.apply(m_y,y_scaledata);
		if(m_x.length === 0){ m_x = [0]; }
		if(m_y.length === 0){ m_y = [0]; }

		_xscale.domain([d3.min(m_x),d3.max(m_x)])
		// FOR LOG SCALE
		//_xscale.domain([1,d3.max(m_x)])
		.range([0,_chart.width]);

		_yscale.domain([d3.min(m_y),d3.max(m_y)])
		// FOR LOG SCALE
		//_yscale.domain([1,d3.max(m_y)])
		.range([_chart.height,0]);

		if(!slider || zoom){
			update_axes(series_x.name,x_series,series_y.name,y_series);
		}

		var bubbles = _svg.selectAll(".bubble")
			.data(map,function(d){ return d.countryid; });

		bubbles.enter()
			.append("g")
			.attr("class",function(d){
				return "bubble " + d.region;
			})
			.attr("transform","translate(" + [0, _chart.height] + ")")	
		.append("circle")
			.attr("class",function(d){ 
				return "bubble-" + d.countryid;
			})
			.attr("r",_chart.bubble_width)
			.attr("cx",0)
			.attr("cy",0)
		.on("mouseover",function(d){
			var parent = d3.select(this.parentNode);
			parent.moveToFront();
			//console.log(d.x[+date-1990],+date-1990)
			if(parent.classed("highlight-lock") === false){
				d3.select(".entry-" + d.countryid).classed("highlight",true);
				//var num_labels = check_numlabels();
				//if(num_labels <= 10){
					//return set_countrylabel(parent,d.country,d.countryid);
				//}
			}
			return set_check_countrylabel(parent,d.country,d.countryid);
		})
		.on("mouseout",function(d){
			var parent = d3.select(this.parentNode);
			if(parent.classed("highlight-lock") === false){
				d3.select(".entry-" + d.countryid).classed("highlight",false);
				return rm_check_countrylabel(parent);
			}
		})
		.on("click",function(d){
			var parent = d3.select(this.parentNode);
			if(parent.classed("highlight-lock") === false){
				d3.select(".entry-" + d.countryid).classed("highlight-lock",true);
				parent.classed("highlight-lock",true)
					.moveToFront();
				set_temporalline(d.countryid);
				d3.select("#" + d.region).classed("highlight-lock",true);
			}else{
				d3.select(".entry-" + d.countryid).classed("highlight-lock",false);
				parent.classed("highlight-lock",false);
				rm_temporalline(d.countryid);
				if(d3.selectAll(".bubble.highlight-lock ." + d.region)[0][0] === undefined){
					d3.select("#" + d.region).classed("highlight-lock",false);
				}
			}
			rm_force_countrylabel(parent);
			return set_check_countrylabel(parent,d.country,d.countryid);
		})

		bubbles.transition()
			.duration(function(){
				if(slider === "fast"){
					return _main_transition.very_fast_duration;
				}else{
					return _main_transition.duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(d){
				var x_value = d.x[+date-1990],
					y_value = d.y[+date-1990];

				if(zoom){
					if(x_value === 0 || y_value === 0){
						d3.select(".entry-" + d.countryid)
							.classed("inactive",true)
						.select("td:first-child")
							.html("&#10005");
					}else{
						d3.select(".entry-" + d.countryid)
							.classed("inactive",false)
						.select("td:first-child")
							.html("<i class='fa fa-eye'></i>");
					}
				}else{
					d3.select(".entry-" + d.countryid)
						.classed("inactive",false)
					.select("td:first-child")
						.html("<i class='fa fa-eye'></i>");
				}

				return "translate(" + [_xscale(x_value), _yscale(y_value)] + ")";
			})
			.each(function(d){
				var x_value = d.x[+date-1990],
					y_value = d.y[+date-1990];

				d3.select(this).select("circle")
					.transition()
					.duration(_main_transition.duration)
					.ease(_main_transition.ease)
					.attr("r",function(){
						if(x_value === 0 || y_value === 0){
							return _chart.sm_bubble_width;
						}else{
							return _chart.bubble_width;
						}
					});

				d3.select(this)
					.style("display",function(){
						if(zoom){
							if(x_value === 0 || y_value === 0){
								return "none";
							}else{
								return "block";
							}
						}
					});

				if(d3.select(this).classed("highlight-lock") === true){
					set_temporalline(d.countryid);
				}
			})

		bubbles.exit()
			.remove();
	});
}

function set_temporalline(idx){
	var svg = d3.select("#canvas"),
		year = determine_year(),
		data = d3.select(".bubble-" + idx).datum();

	var ts_data = new Array();
	for(var j=1990; j<=year; j++){
		ts_data.push({ "x": data.x[j-1990], "y": data.y[j-1990]});
	}

	d3.selectAll(".ts-" + idx).remove();

	svg.append("g")
		.datum(ts_data)
		.attr("class",function(d){ return "ts-" + idx })
		.each(function(d){
			var line_data = timeseries(d);
			if(line_data){
				var segments = line_data.split("M");
					render_data = new Array();
				segments.shift();
				
				segments.forEach(function(d,i){
					if(i < segments.length-1){
						var first_point = d.split("L"),
							first_point = first_point[first_point.length-1],
							last_point = segments[i+1].split("L")[0],
							path = [first_point,last_point].join("L");
					}
					render_data.push("M" + d);
					if(path) render_data.push("M" + path);
				})
				
				var lines = d3.select(this).selectAll("timeseries")
					.data(render_data);
				lines.enter()
					.append("path")
					.attr("class","timeseries")
					.attr("stroke-dasharray",function(d,i){
						if(i%2!==0){
							return "5,5";
						}else{
							return null;
						}
					})
					.style("stroke-width",function(d,i){
						if(i%2!==0){
							return 1;
						}else{
							return null;
						}
					})
					.attr("d",function(d){ return d; });
			}
		})
		.moveToFront();

	/*svg.append("path")
		.datum(ts_data)
		.attr("class",function(d){
			return "timeseries ts-" + idx;
		})
		.attr("d",timeseries)
		.moveToFront();*/

	return d3.select(d3.select(".bubble-" + idx).node().parentNode).moveToFront();
}

function set_picker_series(position){
	var svg = d3.select("svg");

	d3.select("body")
		.on("click",function(){
			d3.selectAll(".series-picker-menu").remove();
			d3.selectAll(".axis-label button").classed("active",false);
		});

	return $.post("/retrieveunique", 
		$.param({ "colname": "GoalName" }, true)
	)
	.done(function(goals){

		goals = goals.split(",,,");
		goals.sort();

		var fo = svg.append("foreignObject")
			.attr("class","series-picker-menu")
			.attr("width",_picker_series.width)
			.attr("height",(goals.length) * _picker_series.height)
			.attr("transform",function(){
				var x = _svg.hpadding,
					y = _svg.height-_svg.vpadding-(goals.length) * _picker_series.height;
				return "translate(" + [x,y] + ")";
			});

		var fo_body = fo.append("xhtml:body")
			.attr("class","fo-body picker");

		var ll1 = fo_body.append("div")
				.attr("class","series-list list-goals " + position)
				.append("ul")
				.attr("class","series-list-container-l1");
		var ll1_entries = ll1.selectAll("li.goal")
				.data(goals);
		ll1_entries.enter()
			.append("li")
			.attr("class","series goal")
			.html(function(d){ 
				if(d.indexOf("Goal 1.") !== -1){
					var icon = "fa-money";
				}else if(d.indexOf("Goal 2.") !== -1){
					var icon = "fa-graduation-cap";
				}else if(d.indexOf("Goal 3.") !== -1){
					var icon = "fa-venus-mars";
				}else if(d.indexOf("Goal 4.") !== -1){
					var icon = "fa-child";
				}else if(d.indexOf("Goal 5.") !== -1){
					var icon = "fa-venus-mars";
				}
				else if(d.indexOf("Goal 6.") !== -1){
					var icon = "fa-medkit";
				}else if(d.indexOf("Goal 7.") !== -1){
					var icon = "fa-leaf";
				}else if(d.indexOf("Goal 8.") !== -1){
					var icon = "fa-globe";
				}

				return "<table><tr><td><i class='fa " + icon + "'></i></td><td>" + d + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>"; 
			})
			.on("mouseover",function(d,i){

				var parent = d3.select(this);
				d3.selectAll("li.series.goal").classed("active",false);
				parent.classed("active",true);

				return $.post("/retrieveunique", 
					$.param({ "colname": "TargetName", "subset_key": "GoalName", "subset_value": d }, true)
				)
				.done(function(targets){

					rm(".list-targets");
					rm(".list-series");
					
					targets = targets.split(",,,");
					targets.sort();

					var offset_top = 0;

					var ll2 = fo_body.append("div")
							.attr("class","series-list list-targets " + position)
						.append("ul")
							.attr("class","series-list-container-l2")
							.style("margin-top",offset_top + "px");
					var ll2_entries = ll2.selectAll("li.target")
							.data(targets);
					ll2_entries.enter()
						.append("li")
						.attr("class","series target")
						.html(function(c){ 
							return "<table><tr><td>" + c + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>"; 
						})
						.on("mouseover",function(c,j){

							var parent = d3.select(this);
							d3.selectAll("li.series.target").classed("active",false);
							parent.classed("active",true);

							return $.post("/retrieveunique", 
								$.param({ "colname": "SeriesName", "subset_key": "TargetName", "subset_value": c }, true)
							)
							.done(function(series){

								rm(".list-series");

								series = series.split(",,,");
								series.sort();

								var ll3 = fo_body.append("div")
										.attr("class","series-list list-series " + position)
									.append("ul")
										.attr("class","series-list-container-l3")
										//.style("margin-top",offset_top + "px");
								var ll3_entries = ll3.selectAll("li.series")
										.data(series);
								ll3_entries.enter()
									.append("li")
									.attr("class","series indicator")
									.html(function(b){ 
										return b;
									})
									.on("mouseover",function(){
										var parent = d3.select(this);
										d3.selectAll("li.series.indicator").classed("active",false);
										parent.classed("active",true);
									})
									.on("mouseout",function(){
										var parent = d3.select(this);
										parent.classed("active",false);
									})
									.on("click",function(b){
										return $.post("/retrievedata", 
											$.param({ "colname": "SeriesRowId", "subset_key": "SeriesName", "subset_value": b }, true)
										)
										.done(function(code){

											code = code[0];
											//rm(".series-picker-menu");

											if(position === "abscisse"){
												var y_series = d3.select(".y-label").datum(),
													year = determine_year();
												return set_bubbles(code,y_series,year);
											}else{
												var x_series = d3.select(".x-label").datum(),
													year = determine_year();
												return set_bubbles(x_series,code,year);
											}
										});
									});

							});
						})
				});
				d3.event.stopPropagation();
			})
		});
}

function set_countrylabel(parent,d,dcode){
	
	rm(".label-" + dcode);

	var text = parent.insert("text","circle")
		.attr("class","ctr-label-text label-" + dcode)
		.attr("text-anchor","middle")
		.attr("y",0)
		.style("opacity",0)
		.text(d);

	text.transition()
		.duration(_main_transition.fast_duration)
		.ease("elastic-in")
		.attr("y",-_chart.bubble_width*3)
		.style("opacity",1);

	var bbox = text.node().getBBox();

	var contour = parent.insert("rect","text")
		.attr("class","ctr-label-contour label-" + dcode)
		.attr("width",bbox.width + 20)
		.attr("height",bbox.height + 12)
		.attr("x",-bbox.width/2 - 10)
		.attr("y",-bbox.height/2 - 6);

	contour.transition()
		.duration(_main_transition.fast_duration)
		.ease("elastic-in")
		.attr("x",-bbox.width/2 - 10)
		.attr("y",-_chart.bubble_width*3-bbox.height - 2);

	var line = parent.insert("line","rect")
		.attr("class","ctr-label-line label-" + dcode)
		.attr("x1",0)
		.attr("y1",-parent.select("circle").attr("r"))
		.attr("x2",0)
		.attr("y2",-_chart.bubble_width);

	line.transition()
		.duration(_main_transition.fast_duration)
		.ease(_main_transition.ease)
		.attr("y2",-_chart.bubble_width*3)
}

function set_countrymenu(countries){
	var svg = d3.select("svg");
		
	/*countries = d3.nest()
		.key(function(d){ return d.Country })
		.entries(countries);*/

	var map_menu = svg.append("g")
		.attr("class","map-menu")
		.attr("transform","translate(" + [_chart.width + 25,0] + ")");

	map_menu.append("rect")
		.attr("width",_svg.width - _chart.width - _svg.hpadding - 25)
		.attr("height", 150)
		.attr("x",_svg.hpadding)
		.attr("y",_svg.vpadding/2);

	var map_fo = map_menu.append("foreignObject")
		.attr("class","country-picker-map")
		.attr("width",_svg.width - _chart.width - _svg.hpadding - 25)
		.attr("height", 150)
		.attr("x",_svg.hpadding)
		.attr("y",_svg.vpadding/2);

	var map_fo_body = map_fo.append("xhtml:body")
		.attr("class","fo-body region-picker")
	.append("svg")
		.attr("id","world-map")
		.html(map_data);

	var fo = svg.append("foreignObject")
		.attr("class","country-picker-menu")
		.attr("width",_svg.width - _chart.width - _svg.hpadding)
		.attr("height",_chart.height - 160 + _svg.vpadding)
		.attr("x",_chart.width + _svg.hpadding)
		.attr("y",160 + _svg.vpadding/2);

	var fo_body = fo.append("xhtml:body")
		.attr("class","fo-body country-picker");	

	var selectors = fo_body.append("div")
		.attr("class","multiple-selectors")
	.append("table")
	.append("tr");

	selectors.append("td")
		.attr("class","show-all")
		.html("<i class='fa fa-eye'></i>")
		.on("mouseover",function(){
			var node = d3.select(this);
			if(node.classed("show-all") === true){
				return d3.selectAll(".show-country").classed("highlight",true);
			}else{
				return null;
			}
		})
		.on("mouseout",function(){
			return d3.selectAll(".show-country").classed("highlight",false);
		})
		.on("click",function(d){
			var bubble_parent = d3.selectAll(".bubble"),
				node = d3.select(this),
				sibling = d3.select(".highlight-all"),
				parent = d3.selectAll(".ctr-entry"),
				eyes = d3.selectAll(".show-country"),
				names = d3.selectAll(".highlight-country");
			if(node.classed("show-all") === true){
				node.html("&thinsp;&#10005");
				eyes.html("&thinsp;&#10005");
				eyes.classed("highlight",false);
				parent.classed("highlight-lock",false)
					.classed("highlight",false)
					.classed("inactive",true);
				node.classed("show-all",false)
					.classed("hide-all",true);
				sibling.classed("block",true);
				//rm_check_countrylabel(bubble_parent);
				rm_force_countrylabel();
				bubble_parent.classed("highlight-lock",false)
					.classed("hide",true);
				//rm_temporalline(d.countryid);
			}else{
				node.html("<i class='fa fa-eye'></i>");
				eyes.html("<i class='fa fa-eye'></i>");
				parent.classed("inactive",false);
				node.classed("hide-all",false)
					.classed("show-all",true);
				sibling.classed("block",false);
				//parent.classed("inactive",false);
				bubble_parent.classed("hide",false);
			}
		});

	selectors.append("td")
		.attr("class","highlight-all")
		.html("Select All Countries <span style='float:right;'><i class='fa fa-angle-down'></i></span>")
		.on("mouseover",function(){
			var node = d3.select(this),
				names = d3.selectAll(".highlight-country"),
				drill = d3.selectAll(".drill-down-country");
			if(node.classed("block") === false){
				names.classed("highlight",true);
				//drill.classed("highlight",true);
			} return
		})
		.on("mouseout",function(){
			var node = d3.select(this),
				names = d3.selectAll(".highlight-country"),
				drill = d3.selectAll(".drill-down-country");
			names.classed("highlight",false);
			//drill.classed("highlight",false);
			return
		})
		.on("click",function(d){
			var bubble_parent = d3.selectAll(".bubble"),
				node = d3.select(this),
				parent = d3.selectAll(".ctr-entry"),
				eyes = d3.selectAll(".show-country"),
				names = d3.selectAll(".highlight-country"),
				drill = d3.selectAll(".drill-down-country");
			if(node.classed("highlight-all") === true){
				node.html("Deselect All Countries <span style='float:right;'><i class='fa fa-angle-down'></i></span>");
				//parent.classed("highlight-lock",false);
				node.classed("highlight-all",false)
					.classed("dim-all",true);
				bubble_parent.classed("highlight-lock",false)
					.classed("hide",true);
				//rm_countrylabel(bubble_parent);
				//rm_temporalline(d.countryid);
			}else{
				node.html("Select All Countries <span style='float:right;'><i class='fa fa-angle-down'></i></span>")
				node.classed("dim-all",false)
					.classed("highlight-all",true);
				//parent.classed("inactive",false);
				bubble_parent.classed("hide",false);
			}
		});

	var list_menu = fo_body.append("div")
			.attr("class","ctr-list-menu")
		.append("table");
	var list_entries = list_menu.selectAll("tr.ctr-entry")
		.data(countries);

	list_entries.enter()
		.append("tr")
		.attr("class",function(d){
			return "ctr-entry entry-" + d.countryid + " entry-" + d.region;
		})
		.on("mouseover",function(d){
			var node = d3.select(this),
				bubble = d3.select(".bubble-" + d.countryid),
				bubble_parent = d3.select(bubble.node().parentNode);

			toggle_class(node,"highlight")

			//if(node.classed("highlight-lock") === false && node.classed("inactive") === false){
				//node.classed("highlight",true);
				//var num_labels = check_numlabels();
				//if(num_labels <= 10){
					//return set_countrylabel(bubble_parent,d.country,d.countryid);
				//}
				//set_countrylabel(bubble_parent,d.country,d.countryid);
			//}
			bubble_parent.moveToFront();
			return set_check_countrylabel(bubble_parent,d.country,d.countryid);
		})
		.on("mouseout",function(d){
			var node = d3.select(this),
				bubble = d3.select(".bubble-" + d.countryid),
				bubble_parent = d3.select(bubble.node().parentNode);
			
			toggle_class(node,"highlight")

			//bubble_parent.classed("highlight",false);
			if(node.classed("highlight-lock") === false){
				//node.classed("highlight",false);
				rm_check_countrylabel(bubble_parent);
			}
			var num_labels = check_numlabels();
			if(num_labels > 10){
				return rm_check_countrylabel(bubble_parent);
			}
		})

	list_entries.append("td")
		.attr("class","show-country")
		.html("<i class='fa fa-eye'></i>")
		.on("click",function(d){
			var bubble = d3.select(".bubble-" + d.countryid),
				bubble_parent = d3.select(bubble.node().parentNode),
				node = d3.select(this),
				parent = d3.select(this.parentNode);
			if(parent.classed("inactive") === false){
				node.html("&thinsp;&#10005");
				parent.classed("highlight-lock",false);
				parent.classed("inactive",true);
				bubble_parent.classed("highlight-lock",false)
					.classed("hide",true);
				rm_countrylabel(bubble_parent);
				rm_temporalline(d.countryid);
			}else{
				node.html("<i class='fa fa-eye'></i>");
				parent.classed("inactive",false);
				bubble_parent.classed("hide",false);
			}
		});

	list_entries.append("td")
		.attr("class","highlight-country")
		.html(function(d){ return d.country; })
		.on("click",function(d){
			var parent = d3.select(this.parentNode),
				bubble = d3.select(".bubble-" + d.countryid),
				bubble_parent = d3.select(bubble.node().parentNode);

			toggle_class(parent,"highlight-lock");
			toggle_class(bubble_parent,"highlight-lock");

			if(parent.classed("highlight-lock") === false && parent.classed("inactive") === false){
				//parent.classed("highlight-lock",true);
				//parent.classed("highlight",false);
				//bubble_parent.classed("highlight-lock",true)
					//.moveToFront();
				set_temporalline(d.countryid);
				d3.select("#" + d.region).classed("highlight-lock",true);
				/*var num_labels = check_numlabels();
				if(num_labels > 10){
					return rm_force_countrylabel();
				}*/
			}else{
				//parent.classed("highlight-lock",false);
				//bubble_parent.classed("highlight-lock",false);
				rm_temporalline(d.countryid);
				if(d3.selectAll(".bubble.highlight-lock ." + d.region)[0][0] === undefined){
					d3.select("#" + d.region).classed("highlight-lock",false);
				}
			}
			var num_labels = check_numlabels();
			if(num_labels > 10){
				return rm_force_countrylabel();
			}
		});

	list_entries.append("td")
		.attr("class","drill-down-country")
		.html("<i class='fa fa-bullseye'></i>");

	var zoom_menu = fo_body.append("div")
		.attr("class","zoom-menu");

	zoom_menu.append("div")
		.attr("class","zoom-in")
		.html("<i class='fa fa-search-plus'></i>")
		.on("mousedown",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",true);
			}
		})
		.on("mouseup",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",false);
			}
		})
		.on("click",function(){
			if(_play_interval !== undefined){ 
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval);
			}
			if(d3.select(this).classed("disabled") === false){
				var x_series = d3.select(".x-label").datum(),
					y_series = d3.select(".y-label").datum(),
					year = determine_year();
				set_bubbles(x_series,y_series,year,null,"zoom");
				d3.select(".zoom-out").classed("disabled",false);
				d3.select(this).classed("disabled",true);
				zoom_feedback("plus");
			};
		});

	zoom_menu.append("div")
		.attr("class","zoom-out disabled")
		.html("<i class='fa fa-search-minus'></i>")
		.on("mousedown",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",true);
			}
		})
		.on("mouseup",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",false);
			}
		})
		.on("click",function(){
			if(_play_interval !== undefined){ 
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval); 
			}
			if(d3.select(this).classed("disabled") === false){
				var x_series = d3.select(".x-label").datum(),
					y_series = d3.select(".y-label").datum(),
					year = determine_year();
				set_bubbles(x_series,y_series,year,null);
				d3.select(".zoom-in").classed("disabled",false);
				d3.select(this).classed("disabled",true);
				zoom_feedback("minus");
			}
		});
}

function set_timeline(){
	$("#timeline").slider({
	    ticks: [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
	    ticks_labels: ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015"],
	    ticks_snap_bounds: 30
	})
	.on("slide",function(){
		var x_series = d3.select(".x-label").datum(),
			y_series = d3.select(".y-label").datum(),
			year = determine_year();
		set_bubbles(x_series,y_series,year,"fast");
		d3.select("#play-btn").classed("active",false)
			.html("&#9658;");
		clearInterval(_play_interval);
	})
	.on("slideStop",function(){
		var x_series = d3.select(".x-label").datum(),
			y_series = d3.select(".y-label").datum(),
			year = determine_year();
		set_bubbles(x_series,y_series,year,"slow");
		d3.select("#play-btn").classed("active",false)
			.html("&#9658;");
		clearInterval(_play_interval);
	});
	d3.selectAll(".tooltip").remove();

	d3.select("#play-btn")
		.on("click",function(){
			var node = d3.select(this);
			if(node.classed("active") === false){
				node.classed("active",true)
					.html("&#10005");
				//var year = $("#timeline").slider().slider('getValue');
				var year = determine_year();
				if(year === 2015){ year = 1989; }
				_play_interval = setInterval(function(){
					year ++;
					if(year === 2015){
						clearInterval(_play_interval);
						node.classed("active",false)
							.html("&#9658;");
					};
					$("#timeline").slider().slider('setValue',year);
					var x_series = d3.select(".x-label").datum(),
						y_series = d3.select(".y-label").datum();
					set_bubbles(x_series,y_series,year,"slow");
				}, 1000);
			}else{
				node.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval);
			}
		})
}