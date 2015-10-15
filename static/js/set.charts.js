function set_svg(){
	var svg = d3.select("#container")
		.append("svg")
		.attr("width",_svg.width)
		.attr("height",_svg.height);
	
	svg.append("g")
		.attr("id","canvas")
		.attr("transform","translate(" + [_svg.hpadding,_svg.vpadding/2] + ")");

	// ---- CREATE ARROW HEADS ---- //
	var arrow_marker = svg.append("marker")
		.attr("id", "markerArrow")
		.attr("markerWidth", 8)
		.attr("markerHeight", 8)
		.attr("refX", 5)
		.attr("refY", 5)
        .attr("orient", "auto")
        
    arrow_marker.append("circle")
    	.attr("class","arrow-head")
    	.attr("cx",5)
    	.attr("cy",5)
    	.attr("r",3);
    /*arrow_marker.append("path")
    	.attr("class","arrow-head")
    	.attr("d", "M2,2 L-8,-4 L2,-9");*/
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
			var locked = d3.select(this).classed("lock");
			if(!locked){
				d3.event.stopPropagation();
				d3.select(this).select("button").classed("active",true);
				if(_play_interval !== undefined){ 
					d3.select("#play-btn")
						.classed("active",false)
						.html("<i class='fa fa-play'></i>");
					clearInterval(_play_interval); 
				}
				return set_series_menu("abscisse");
			}
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
			var locked = d3.select(this).classed("lock");
			if(!locked){
				d3.event.stopPropagation();
				d3.select(this).select("button").classed("active",true);
				if(_play_interval !== undefined){
					d3.select("#play-btn")
						.classed("active",false)
						.html("<i class='fa fa-play'></i>");
					clearInterval(_play_interval); 
				}
				return set_series_menu("ordonnees");
			}
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

function update_axes(x_label,x_series,x_goal,y_label,y_series,y_goal,duration,x_target,y_target){
	//console.log(x_target,y_target)
	
	var type = get_chart_type();

	if(type === "sp"){
		_xaxis.tickFormat(null);
	}else if(type === "lg"){
		_xaxis.tickFormat(d3.format("d"));
	}

	if(x_goal === 1){
		var x_icon = "fa-money";
	}else if(x_goal === 2){
		var x_icon = "fa-graduation-cap";
	}else if(x_goal === 3){
		var x_icon = "fa-venus-mars";
	}else if(x_goal === 4){
		var x_icon = "fa-child";
	}else if(x_goal === 5){
		var x_icon = "fa-hospital-o";
	}else if(x_goal === 6){
		var x_icon = "fa-medkit";
	}else if(x_goal === 7){
		var x_icon = "fa-leaf";
	}else if(x_goal === 8){
		var x_icon = "fa-globe";
	}

	if(y_goal === 1){
		var y_icon = "fa-money";
	}else if(y_goal === 2){
		var y_icon = "fa-graduation-cap";
	}else if(y_goal === 3){
		var y_icon = "fa-venus-mars";
	}else if(y_goal === 4){
		var y_icon = "fa-child";
	}else if(y_goal === 5){
		var y_icon = "fa-hospital-o";
	}else if(y_goal === 6){
		var y_icon = "fa-medkit";
	}else if(y_goal === 7){
		var y_icon = "fa-leaf";
	}else if(y_goal === 8){
		var y_icon = "fa-globe";
	}

	d3.select(".x.axis")
		.transition()
		.duration(function(){
			if(!duration){
				return _main_transition.fast_duration;
			}else{
				return duration;
			}
		})
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

				rm_big_feedback_icon();
		})

	d3.select(".x-label")
		.datum({ "SeriesRowId": x_series, "SeriesName": x_label, "TargetId": x_target, "GoalId": x_goal })
		.html("<i class='fa " + x_icon + "'></i>&nbsp;" + x_label + "&nbsp;&#65514;");

	d3.select(".y.axis")
		.transition()
		.duration(function(){
			if(!duration){
				return _main_transition.fast_duration;
			}else{
				return duration;
			}
		})
		.ease(_main_transition.ease)
		.call(_yaxis)
		.each("end",function(){
			d3.select(".y.axis")
				.selectAll(".tick")
				.select("line")
				.attr("stroke-dasharray","5,5")
				.transition()
				.duration(function(){
					if(!duration){
						return _main_transition.fast_duration;
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("x2",_xscale.range()[1]);
		});

	d3.select(".y-label")
		.datum({ "SeriesRowId": y_series, "SeriesName": y_label, "TargetId": y_target, "GoalId": y_goal })
		.html("<i class='fa " + y_icon + "'></i>&nbsp;" + y_label + "&nbsp;&#65516;");
	return;
}

function set_bubbles(x_series,y_series,date,issoloed,sctr,sregion){

	var svg = d3.select("#canvas"),
		variability_x = null,
		variability_y = null;
	rm_temporalline();

	// ---- SET THE LOADER ICON ---- //
	set_big_feedback_icon("fa-spin fa-spinner","n");
	d3.selectAll(".variability").remove();
	d3.selectAll(".ts").remove();
	rm_force_countrylabel(d3.selectAll(".bubble:not(.highlight-lock)"));
	rm_goal_line();
	rm_stat_lines();
	rm_correlation_line();

	if(!sctr && !sregion){
		var parameters = { column: "SeriesRowId", value: [x_series,y_series], date: date };
	}else if(sctr && !sregion){
		var parameters = { column: "SeriesRowId", value: [x_series,y_series], date: date, ctr: sctr };
	}else if(!sctr  && sregion){
		var parameters = { column: "SeriesRowId", value: [x_series,y_series], date: date, region: sregion};
	}else{
		var parameters = { column: "SeriesRowId", value: [x_series,y_series], date: date, ctr: sctr, region: sregion};
	}

	return $.post("retrieveseries", 
		$.param(parameters, true)
		)
	.done(function(data){
		// ---- REMOVE THE LOADER ICON ---- //
		//rm_big_feedback_icon();
		//console.log(data)

		var isolationId = check_isolation(),
			type = get_chart_type();

		var series_x = new Array(),
			series_y = new Array();

		var xs = { "gmax": data[0].gx_max, "gmin": data[0].gx_min, "dmax": data[0].dx_max, "dmin": data[0].dx_min },
			ys = { "gmax": data[0].gy_max, "gmin": data[0].gy_min, "dmax": data[0].dy_max, "dmin": data[0].dy_min };


		data.forEach(function(d,i){
			if(d.axis === "x"){
				if(d.R1RowId){
					variability_x = [d.R1RowId, d.R2RowId];
				}
				return series_x.push({ "name": d.SeriesName, "code": d.SeriesRowId, "target": d.TargetId, "goal": d.GoalId });
			}else if(d.axis === "y"){
				if(d.R2RowId){
					variability_y = [d.R1RowId, d.R2RowId];
				}
				return series_y.push({ "name": d.SeriesName, "code": d.SeriesRowId, "target": d.TargetId , "goal": d.GoalId });
			}
		});


		if(variability_x || variability_y){
			d3.select(".variability-menu").classed("hide",false);
		}else{
			d3.select(".variability-menu").classed("hide",true)
				.classed("active",true);
		}

		/*if(isolationId){
			data = data.filter(function(d){
				return d.CountryId === isolationId;
			})
		}*/

		//console.log(variability_x,variability_y)
		//console.log(series_x)

		series_x = series_x[0];
		series_y = series_y[0];

		data = d3.nest()
			.key(function(d){ return d.CountryName; })
			.entries(data);

		var map = data.map(function(d){
			var x_values = new Array(25),
				x_variance, 
				//x_values_range = new Array(25),
				y_values = new Array(25),
				y_variance,
				//y_values_range = new Array(25),
				country_id, region;

			for(var j=0; j<26; j++){
				x_values[j] = "NA";
				y_values[j] = "NA";
			}
			
			var determine_x = "NA";

			d.values.map(function(c,i){
				country_id = c.CountryId;
				region = c.Region;
				country_name = c.CountryName;
				full_region = c.MdgRegions;
				x_gmax = c.gx_max;
				x_gmin = c.gx_min;
				y_gmax = c.gy_max;
				y_gmin = c.gy_min;
				x_dmax = c.dx_max;
				x_dmin = c.dx_min;
				y_dmax = c.dy_max;
				y_dmin = c.dy_min;

				if(type === "sp"){	
					if(c.axis === "x"){
						x_values[+c.Year-1990] = c.Value;
						x_variance = c.Discrimination;
					}else if(c.axis === "y"){
						y_values[+c.Year-1990] = c.Value;
						y_variance = c.Discrimination;
					}
				}else if(type === "lg"){
					/* ---- WHAT WE WANT HERE IS THE INDEXES WHERE Y-VALUES ARE DIFFERENT FROM 0 ---- */
					if(c.axis === "y"){
						if(c.Value > 0){ determine_x = c.Year; }
						x_values[+c.Year-1990] = determine_x;
						y_values[+c.Year-1990] = c.Value;
						y_variance = c.Discrimination;
						//console.log(y_values)
					}
				}
			});
			/* ---- NOW WE CONVERT THE INDEXES TO YEARS ---- */
			if(type === "lg"){
				x_values.forEach(function(b,i){
					if(i !== 0 && b === "NA"){
						return x_values[i] = x_values[i-1];
					}
				});
			}

			//if(d.key==="Afghanistan") console.log(d3.max(x_values))
			return { "x": x_values, "y": y_values, "country": d.key, "countryid": country_id, "region": region, "region_name": full_region, "x_variance": x_variance, "y_variance": y_variance, "gs": { "x": { "max": x_gmax, "min": x_gmin }, "y": { "max": y_gmax, "min": y_gmin } }, "ds": { "x": { "max": x_dmax, "min": x_dmin }, "y": { "max": y_dmax, "min": y_dmin } }, "cs": { "x": { "max": d3.max(x_values), "min": d3.min(x_values) }, "y": { "max": d3.max(y_values), "min": d3.min(y_values) } } };
		});

		/* ---- CHECK THE VALUES FOR EACH YEAR TO ADAPT THE SCALES OF YEAR MARKS ---- */
		/*var all_x = map.map(function(d,i){
			if(d3.sum(d.x) === 0){ return i; }else{ return -1; };
		}).filter(function(d){
			return d >= 0;
		});
		var all_y = map.map(function(d,i){
			if(d3.sum(d.y) === 0){ return i; }else{ return -1; };
		})
		.filter(function(d){
			return d >= 0;
		});*/
		
		var scale_map = map.slice(0);

		if(isolationId){
			var scale_map = scale_map.filter(function(d){
				if(d.countryid === isolationId){
					xs.cmax = d.cs.x.max;
					xs.cmin = d.cs.x.min;
					ys.cmax = d.cs.y.max;
					ys.cmin = d.cs.y.min;
				}
				return d.countryid === isolationId;
			})
		}
		//console.log(scale_map)

		var null_years = get_null_years(scale_map);
			//slider_data = set_slider_data(null_years);
		/*set_timeline(slider_data)*/

		//null_years.forEach(function(d){
			/* ---- WE NEED TO ADD 3 HERE TO d BECAUSE THERE ARE THREE ELEMENTS IN THE DOM BEFORE THE TICKS ---- */
		/*var timeline = d3.select("#main-timeline"),
			timeline_ticks = d3.selectAll(".slider-tick"),
			play_btn = d3.select("#play-btn");
		

			timeline_ticks.each(function(c,i){
					var node = d3.select(this);
					if(null_years.indexOf(i) !== -1){
						node.style("width","10px")
							.style("height","10px")
							.style("margin-left","-5px")
							.style("margin-top","-4px");
					}else{
						node.style("width",null)
							.style("height",null)
							.style("margin-left",null)
							.style("margin-top",null);
					}
				});*/

			update_timeline(null_years);
		

			/*d3.select(".slider-tick:nth-child(" + (d+4) + ")")
				.style("width","10px")
				.style("height","10px")
				.style("margin-left","-5px")
				.style("margin-top","-4px");
		})*/

		/* ---- FIND THE MISSING COUTRIES AND 
		CHANGE THE COUNTY-LIST ---- */
		var bubble_ctrs = data.map(function(d){ return d.key; });
			/*list_ctrs = d3.selectAll(".ctr-entry").data().map(function(d){ return d.CountryName }),
			diff_ctrs = list_ctrs.diff(bubble_ctrs);*/

		d3.selectAll(".ctr-entry").each(function(d){
			var node = d3.select(this);
			//if(diff_ctrs.indexOf(d.CountryName) !== -1){
			if(bubble_ctrs.indexOf(d.CountryName) === -1){
				node.classed("non-existent",true)
					//.classed(".highlight-lock",false)
					//.style("background-color","red")
				node.select(".show-country")
					.select("i")
					.attr("class","fa fa-chain-broken");
					//.style("background-color","blue"); 
				node.select(".drill-down-country")
					.select("i")
					.attr("class",null);
				//rm_temporalline(d.CountryId);
			}else{
				node.classed("non-existent",false);
				if(d.CountryId === isolationId){
					node.select(".drill-down-country")
						.select("i")
						.attr("class","fa fa-circle");
				}else{
					node.select(".drill-down-country")
						.select("i")
						.attr("class","fa fa-bullseye");
				}
				/* ---- WILL NEED TO CHECK IF USER HAS INACTIVATED 
				ALL COUNTRIES AND ZOOM LEVEL BEFORE RESETTING THE 
				EYE OR A CROSS ---- */

			}
		});

		var zoom = check_zoom();

		if(zoom && !isolationId){
			/*var x_scaledata = scale_map.map(function(d){
				//if(d.y[+date-1990] !== "NA"){
					return d.x[+date-1990];
				//}else{
				//	return 0;
				//}
			});
			var y_scaledata = scale_map.map(function(d){
				//if(d.x[+date-1990] !== "NA"){
					return d.y[+date-1990];
				//}else{
				//	return 0;
				//}
			});
			x_scaledata = x_scaledata.filter(function(d){
				return d !== "NA"; //> 0;
			});
			y_scaledata = y_scaledata.filter(function(d){
				return d !== "NA"; //> 0;
			});*/
			var x_scaledata = [xs.dmin,xs.dmax],
				y_scaledata = [ys.dmin,ys.dmax];
		}else if(!zoom && isolationId){
			var x_scaledata = [0,xs.cmax], //[xs.cmin,xs.cmax],
				y_scaledata = [0,ys.cmax]; //[ys.cmin,ys.cmax];
		}else if(!zoom && !isolationId){
			/*var x_scaledata = scale_map.map(function(d){
				return d.x.filter(function(c,i){ 
						return c !== "NA"; //>= 0;
					})
			});
			var y_scaledata = scale_map.map(function(d){
				return d.y.filter(function(c,i){ 
						return c !== "NA"; //>= 0;
					})
			});*/
			var x_scaledata = [0,xs.gmax], //[xs.gmin,xs.gmax],
				y_scaledata = [0,ys.gmax]; //[ys.gmin,ys.gmax];
		}

		/*var m_x = new Array(),
			m_y = new Array();
		m_x = m_x.concat.apply(m_x,x_scaledata);
		m_y = m_y.concat.apply(m_y,y_scaledata);
		if(m_x.length === 0){ m_x = [0]; }
		if(m_y.length === 0){ m_y = [0]; }*/

		if(type === "sp"){
			//_xscale.domain([d3.min(m_x),d3.max(m_x)])
			_xscale.domain(x_scaledata)
			// FOR LOG SCALE
			//_xscale.domain([1,d3.max(m_x)])
			.range([0,_chart.width]);
		}else if(type === "lg"){
			_xscale.domain([1990,2015])
			.range([0,_chart.width]);
		}
		//console.log(d3.min(m_y))
		//_yscale.domain([d3.min(m_y),d3.max(m_y)])
		_yscale.domain(y_scaledata)
		// FOR LOG SCALE
		//_yscale.domain([1,d3.max(m_y)])
		.range([_chart.height,0]);


		// ---- THE AXES USED TO BE UPDATED HERE ---- //
		/*if(zoom || isolationId){
			update_axes(series_x.name,x_series,series_x.goal,series_y.name,y_series,series_y.goal);
		}*/

		var bubbles = svg.selectAll(".bubble")
			.data(map,function(d){ return d.countryid; });

		bubbles.enter()
			.append("g")
			.attr("class",function(d){
				return "bubble " + d.region;
			})
			.attr("transform","translate(" + [0, _chart.height] + ")")
		.append("circle")
			.attr("class",function(d){ 
				return "main-bubble bubble-" + d.countryid;
			})
			.attr("r",_chart.bubble_width)
			.attr("cx",0)
			.attr("cy",0)
		.on("mouseover",function(d){
			var bubble_parent = d3.select(this.parentNode),
				entry = d3.select(".entry-" + d.countryid);
			bubble_parent.moveToFront();

			/*if(parent.classed("highlight-lock") === false){
				d3.select(".entry-" + d.countryid).classed("highlight",true);
			}*/
			//toggle_class(entry,"highlight");
			entry.classed("highlight",true);
			return set_check_countrylabel(bubble_parent,d.country,d.countryid);
		})
		.on("mouseout",function(d){
			var bubble_parent = d3.select(this.parentNode),
				entry = d3.select(".entry-" + d.countryid),
				num_labels = check_numlabels();

			if(bubble_parent.classed("highlight-lock") === false && num_labels < 10){
				rm_check_countrylabel(bubble_parent);
			}else if(num_labels >= 10){
				rm_check_countrylabel(bubble_parent);
			}
			return entry.classed("highlight",false);
		})
		.on("click",function(d){
			var bubble_parent = d3.select(this.parentNode),
				entry = d3.select(".entry-" + d.countryid),
				map_region = d3.select("#" + d.region),
				type = get_chart_type();

			// ---- NEED MAP STUFF AS WELL ---- //
			//console.log(d3.sum(d.x),d3.sum(d.y),d.countryid)
			
			if(bubble_parent.classed("highlight-lock") === false){
				
				entry.classed("highlight-lock",true)
					.classed("highlight",true);
				
				bubble_parent.classed("highlight-lock",true)
					.moveToFront();
				
				set_temporalline(d.countryid,d.region);
				
				map_region.classed("highlight-lock",true);

			}else{
				/* ---- GET THE NUMBER OF LOCKED COUNTRIES
				BEFORE CHANGING THE STATE OF THIS ONE ---- */
				var original_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;
				/* ---- ENTRY'S HIGHLIGHT MUST BE TRUE HERE BECAUSE OTHERWISE THE MOUSEOUT AFTER THE CLICK WILL MESS THINGS UP: THE MOUSEOUT NEEDS TO LEAVE A HIGHLIGHT = FALSE ---- */
				entry.classed("highlight-lock",false)
					.classed("highlight",true);

				bubble_parent.classed("highlight-lock",false);

				/* ---- NOW GET THE NUMBER OF LOCKED COUNTRIES
				AFTER CHANGING THE STATE OF THIS ONE ---- */
				var final_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;

				if(type !== "lg"){
					rm_temporalline(d.countryid);
				}else{
					d3.select(".ts-" + d.countryid)
						.classed("no-highlight",true);
				}
				//rm_temporalline(d.countryid);

				if(d3.selectAll(".bubble." + d.region + ".highlight-lock")[0][0] === undefined){
					map_region.classed("highlight-lock",false);
				}
				/* --- HERE, IF THERE WAS ORIGINALLY MORE THAN
				TEN SELECTED COUNTRIES, AND THE USER DESLECTS THE 
				TENTH (LEAVING ONLY NINE), THEN ALL THE BUBBLE 
				LABBLES SHOULD POP UP AGAIN. FOR THIS, USE THE
				ORIGINAL AND FINAL LOCKS ---- */
				if(original_locks === 10 && final_locks === 9){
					// ---- SHOW ALL BUBBLE LABELS ---- //
					d3.selectAll(".bubble.highlight-lock")
						.each(function(c){
							var bubble_parent = d3.select(this);
							return set_check_countrylabel(bubble_parent,c.country,c.countryid);
						});
					/* ---- AND SHOW THE LABEL FOR THE CURRENT
					COUNTRY BECAUSE ALTHOUGH THE LOCK IS REMOVED
					IT IS STILL HILIGHTED ---- */
					set_check_countrylabel(bubble_parent,d.country,d.countryid);
				}
			}
			var num_labels = check_numlabels();
			if(num_labels >= 10){
				/* ---- REMOVE ALL LABELS BUT THE ONE
				THE MOUSE CURSOR IS STILL ON ---- */
				rm_force_countrylabel();
				set_check_countrylabel(bubble_parent,d.country,d.countryid);
			}

			/* ---- SCROLL TO COUNTRY IN SIDE MENU ---- */
			//console.log($(".entry-" + d.countryid).position().top)
			//console.log($(".entry-" + d.countryid).offset().top)

			update_list_position(d.countryid);

		});

		/*bubbles.transition()
			.duration(function(){
				if(slider === "fast"){
					return _main_transition.fast_duration;
				}else{
					return _main_transition.duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(d){
				var x_value = d.x[+date-1990],
					y_value = d.y[+date-1990],
					entry = d3.select(".entry-" + d.countryid),
					originally_inactive = entry.classed("user-inactivated");

				if(zoom && originally_inactive === false){
					if(x_value === 0 || y_value === 0){
						entry.classed("inactive",true)
							.select("td:first-child")
								.html("&thinsp;&#10005");
					}else{
						entry.classed("inactive",false)
							//.classed("zoomed-out",false)
							.select("td:first-child")
								.html("<i class='fa fa-eye'></i>");
					}
				}else if(originally_inactive === false){
					entry.classed("inactive",false)
						.select("td:first-child")
							.html("<i class='fa fa-eye'></i>");
				}

				return "translate(" + [_xscale(x_value), _yscale(y_value)] + ")";
			})
			.each(function(d){
				var bubble = d3.select(this),
					entry = d3.select(".entry-" + d.countryid),
					originally_inactive = entry.classed("user-inactivated"),
					x_value = d.x[+date-1990],
					y_value = d.y[+date-1990];

				bubble.select("circle")
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

				if(zoom && originally_inactive === false){
					if(x_value === 0 || y_value === 0){
						bubble.classed("hide",true);
					}else{
						bubble.classed("hide",false);
					}
				}else if(originally_inactive === false){
					bubble.classed("hide",false);
					entry.classed("highlight",false);
				}

				if(d3.select(this).classed("highlight-lock") === true){
					set_temporalline(d.countryid,d.region);
				}
			})
		*/


		/* ---- SET THE UNCERTAINTY ---- */
		check_variability(date,variability_x,variability_y,series_x,series_y,x_series,y_series,xs,ys,issoloed);

		//update_bubbles(date,slider);

		if(!isolationId){
			bubbles.exit()
				.remove();
		}

		

	});
}

function update_bubbles(date,slider,duration){

	var zoom = check_zoom(),
		isolationId = check_isolation(),
		type = get_chart_type();

	// ---- WE MOVE THE REMOVAL OF THE LOADING ICON HERE ---- //

	d3.selectAll(".bubble")
		/*.classed("contextual",function(d){
			if(isolationId){
				if(d.countryid === isolationId){
					return false;
				}else{
					return true;
				}
			}
		})*/
		.each(function(d){
			if(d3.sum(d.x) === 0 && d.x.indexOf("NA") !== -1 || d3.sum(d.y) === 0 && d.y.indexOf("NA") !== -1){
				d3.select(".entry-" + d.countryid)
					.select(".drill-down-country i")
					.attr("class","fa fa-circle-o");
			}
		})
		.transition()
		.duration(function(){
			if(!duration){
				if(slider === "fast"){
					return _main_transition.fast_duration;
				}else{
					return _main_transition.duration;
				}
			}else{
				return duration;
			}
		})
		.ease(_main_transition.ease)
		.attr("transform",function(d,i){
			//if(type === "sp"){
			var x_value = d.x[+date-1990],
				y_value = d.y[+date-1990];

			if(type === "lg"){
				if(i !== 0 && y_value === "NA"){
					var hold_values = d.y.slice(0);
					hold_values.forEach(function(c,i){
						if(i !== 0 && c === "NA"){
							return hold_values[i] = hold_values[i-1];
						}
					});
					y_value = hold_values[+date-1990];
				}
			};
			/*}else if(type === "lg"){
				console.log(d.x)
				var x_value = d.x[+date-1990],
					y_value = d.y[x_value-1990];
			}*/

			var entry = d3.select(".entry-" + d.countryid),
				originally_inactive = entry.classed("user-inactivated");

			if(entry.classed("non-existent") === false){
				if(zoom && originally_inactive === false){
					if(x_value === 0 || y_value === 0){
						entry.classed("inactive",true)
							.select("td:first-child")
								.html("&thinsp;&#10005");
					}else{
						entry.classed("inactive",false)
							//.classed("zoomed-out",false)
							.select("td:first-child")
								.html("<i class='fa fa-eye'></i>");
					}
				}else if(originally_inactive === false){
					entry.classed("inactive",false)
						.select("td:first-child")
							.html("<i class='fa fa-eye'></i>");
				}
			}else{
				entry.classed("inactive",false)
					.select("td:first-child")
						.html("<i class='fa fa-chain-broken'></i>");
			}
			/*console.log(date,x_value)
			console.log(_xscale(x_value),_xscale(2013),_xscale(2015),_chart.width)*/

			if(x_value !== "NA"){
				var new_posx = _xscale(x_value);
			}else{
				var new_posx = - _svg.hpadding + _chart.sm_bubble_width + 2;
			}

			if(y_value !== "NA"){
				var new_posy = _yscale(y_value);
			}else{
				var new_posy = _svg.vpadding + _chart.height - _chart.sm_bubble_width - 2;
			}

			return "translate(" + [new_posx,new_posy] + ")";
		})
		.each(function(d){
			var bubble = d3.select(this),
				//bubble_type = d.bubble_type,
				entry = d3.select(".entry-" + d.countryid),
				originally_inactive = entry.classed("user-inactivated");

			//if(type === "sp"){
			var x_value = d.x[+date-1990],
				y_value = d.y[+date-1990];
			/*}else if(type === "lg"){
				var x_value = d.x[d.x.length-1];
				var y_value = d.y[x_value];*/
				/* ---- THE Y VALUE IS NOT CORRECT HERE BUT IT DOESN'T MATTER BECAUSE WE DON'T USE IT IN THIS PART/THE ONLY USEFUL Y VALUE IS 0 AND WE STILL GET THE 0 VALUES ---- */
				//console.log(y_value)
			//}


			bubble.select(".main-bubble")
				/*.classed("missing-data",function(){
					if(x_value === "NA" || y_value === "NA"){
						return true;
					}else{
						return false;
					}
				})
				.classed("err-bar",function(){
					if(type === "sp"){
						if(d.x_variance !== "TOT" || d.y_variance !== "TOT"){
							return true;
						}else{
							return false;
						}
					}else if(type === "lg"){
						if(d.y_variance !== "TOT"){
							return true;
						}else{
							return false;
						}
					}
				})*/
				.transition()
				.duration(function(){
					if(!duration){
						if(slider === "fast"){
							return _main_transition.fast_duration;
						}else{
							return _main_transition.duration;
						}
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("r",function(){

					/*if(d.countryid === 891){
						console.log(x_value,y_value)
					}*/
					if(x_value === "NA" || y_value === "NA"){
						return _chart.sm_bubble_width;
					}else if(type === "sp"){
						//console.log(d.x_variance,d.y_variance)
						if(d.x_variance !== "TOT" && d.x_variance.indexOf("TOT-") !== -1 || d.y_variance !== "TOT" && d.y_variance.indexOf("TOT-") !== -1){
							var variance_visible = check_variability_menu();
								if(variance_visible){
									return _chart["err-bar"];
								}else{
									return _chart.bubble_width;
								}
						}else{
							return _chart.bubble_width;
						}
					}else if(type === "lg"){
						if(d.y_variance !== "TOT"){
							return _chart["err-bar"];
						}else{
							return _chart.bubble_width;
						}
					}

					/*else if(type === "lg" && y_value === 0){
						return _chart.sm_bubble_width;
					}else{
						if(bubble_type === undefined){
							return _chart.bubble_width;
						}else{
							return _chart[bubble_type];
						}
					}*/
				})
				.each("end",function(){
					var label_pos = determine_bubble_position(bubble),
						contour = bubble.select(".ctr-label-contour");

					if(contour.node()){
						box = { width: contour.attr("width")-20, height: contour.attr("height")-12 };
					}
					
					bubble.select(".ctr-label-text")
						.transition()
						.duration(function(){
							return _main_transition.very_fast_duration;
							/*if(!duration){
								if(slider === "fast"){
									return _main_transition.fast_duration;
								}else{
									return _main_transition.duration;
								}
							}else{
								return duration;
							}*/
						})
						.ease(_main_transition.ease)
						.attr("y",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3 + box.height + 2;
							}else if(label_pos[1] === "middle"){
								return 5;
							}
						})
						.attr("x",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -_chart.bubble_width*3 - box.width/2 - 10; //-bbox.width - 20;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3 + box.width/2 + 10; //-bbox.
							}
						})

					bubble.select(".ctr-label-contour")
						.transition()
						.duration(function(){
							return _main_transition.very_fast_duration;
							/*if(!duration){
								if(slider === "fast"){
									return _main_transition.fast_duration;
								}else{
									return _main_transition.duration;
								}
							}else{
								return duration;
							}*/
						})
						.ease(_main_transition.ease)
						.attr("x",function(){
							if(label_pos[0] === "center"){
								return -box.width/2 - 10;
							}else if(label_pos[0] === "left"){
								//console.log(box.width)
								return -_chart.bubble_width*3 - box.width - 20; //-bbox.width - 20;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3; //-bbox.
							}
						})
						.attr("y",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3 - box.height - 2;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3;
							}else if(label_pos[1] === "middle"){
								return -_chart.bubble_width;
							}
						});

					bubble.select(".ctr-label-line")
						.transition()
						.duration(function(){
							return _main_transition.very_fast_duration;
							/*if(!duration){
								if(slider === "fast"){
									return _main_transition.fast_duration;
								}else{
									return _main_transition.duration;
								}
							}else{
								return duration;
							}*/
						})
						.ease(_main_transition.ease)
						.attr("x1",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -bubble.select(".main-bubble").attr("r");
							}else if(label_pos[0] === "right"){
								return bubble.select(".main-bubble").attr("r");
							}
						})
						.attr("y1",function(){
							if(label_pos[1] === "top"){
								return -bubble.select(".main-bubble").attr("r");
							}else if(label_pos[1] === "bottom"){
								return bubble.select(".main-bubble").attr("r");
							}else if(label_pos[1] === "middle"){
								return 0;
							}
						})
						.attr("x2",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -_chart.bubble_width*3;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3;
							}
						})
						.attr("y2",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3;
							}else if(label_pos[1] === "middle"){
								return 0;
							}
						});
				})

			


			/*if(zoom && originally_inactive === false){
				if(x_value === 0 || y_value === 0){
					bubble.classed("hide",true);
				}else{
					bubble.classed("hide",false);
				}
			}else if(originally_inactive === false){
				bubble.classed("hide",false);
				entry.classed("highlight",false);
			}*/

			/* ---- SET THE TEMPORAL LINE ---- */
			if(bubble.classed("highlight-lock") === true || type === "lg"){
				set_temporalline(d.countryid,d.region);
			}
		})

		/* ---- IF THERE IS UNCERTAINTY, UPDATE THE UNCERTAINTY MAP ---*/
		//console.log(d3.select(".bounds").datum())
		if(type !== "lg"){
			d3.selectAll(".x-bound")
				.transition()
				.duration(function(){
					if(!duration){
						if(slider === "fast"){
							return _main_transition.fast_duration;
						}else{
							return _main_transition.duration;
						}
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("d",function(c){
					var year = +date - 1990;
					if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
						var bw = _chart["err-bar"];
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + 
						// ---- MID CURVE RIGHT SECTION HERE ---- //
						" C" + [bw,bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,-bw] + " " + [0,-bw] + " Z" + 
						// ---- LEFT SECTION HERE ---- //
						" M" + [0,bw] + " C" + [-bw,bw] + " " + [0,0] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0] + " C" + [0,0] + " " + [-bw,-bw] + " " + [0,-bw] + " " + 
						// ---- MID CURVE LEFT SECTION HERE ---- //
						 " C" + [-bw,-bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,bw] + " " + [0,bw]  + " Z";	
					}else{
						var bw = _chart.sm_bubble_width;
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,-bw] + " " + [0,-bw] + " Z";

					}
				})
		}

		d3.selectAll(".y-bound")
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("d",function(c){
				var year = +date - 1990;
					if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
						var bw = _chart["err-bar"];
						return "M" + [bw,0] + " C" + [bw,-bw] + " " + [0,-bw] + " " + [0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + " C" + [0,-bw] + " " + [-bw,-bw] + " " + [-bw,0] + 
						// ---- MID CURVE RIGHT SECTION HERE ---- //
						" C" + [-bw,-bw] + " " + [0,-bw] + " " + [0,-bw] + " C" + [0,-bw] + " " + [bw,-bw] + " " + [bw,0] + " Z" + 
						// ---- LEFT SECTION HERE ---- //
						" M" + [bw,0] + " C" + [bw,bw] + " " + [0,bw] + " " + [0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])] + " C" + [0,bw] + " " + [-bw,bw] + " " + [-bw,0] + " " + 
						// ---- MID CURVE LEFT SECTION HERE ---- //
						" C" + [-bw,bw] + " " + [0,bw] + " " + [0,bw] + " C" + [0,bw] + " " + [bw,bw] + " " + [bw,0]  + " Z";
					}else{
						var bw = _chart.sm_bubble_width;
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
					}
			});

		// NEED TO UPDATE THE GENDER STUFF
		d3.selectAll(".disc-xy.disc-1")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(c){
				var year = +date - 1990;
				var xpos = c.variability.x1[year] !== "NA" ? _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]) : 0,
					ypos = c.variability.y1[year] !== "NA" ? _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [xpos,ypos] + ")";
			});
		d3.selectAll(".disc-xy.disc-2")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(c){
				var year = +date - 1990;
				var xpos = c.variability.x2[year] !== "NA" ? _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]) : 0,
					ypos = c.variability.y2[year] !== "NA" ? _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [xpos,ypos] + ")";
			});
		
		if(type !== "lg"){
			d3.selectAll(".disc-x.disc-1")
				/*.classed("hide",function(c){
					var year = +date - 1990,
						bubble_parent = d3.select(this.parentNode);
					if(c.variability.x1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
						return true;
					}else{
						return false;
					}
				})*/
				.transition()
				.duration(function(){
					if(!duration){
						if(slider === "fast"){
							return _main_transition.fast_duration;
						}else{
							return _main_transition.duration;
						}
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("transform",function(c){
					var year = +date - 1990,
						xpos = c.variability.x1[year] !== "NA" ? _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]) : 0;
						
					return "translate(" + [xpos,0] + ")";
				});
			d3.selectAll(".disc-x.disc-2")
				/*.classed("hide",function(c){
					var year = +date - 1990,
						bubble_parent = d3.select(this.parentNode);
					if(c.variability.x2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || type == "lg" || bubble_parent.classed("hide") === true){
						return true;
					}else{
						return false;
					}
				})*/
				.transition()
				.duration(function(){
					if(!duration){
						if(slider === "fast"){
							return _main_transition.fast_duration;
						}else{
							return _main_transition.duration;
						}
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("transform",function(c){
					var year = +date - 1990,
						xpos = c.variability.x2[year] !== "NA" ? _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]) : 0;
						
					return "translate(" + [xpos,0] + ")";
				});
		}

		d3.selectAll(".disc-y.disc-1")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(c){
				var year = +date - 1990,
					ypos = c.variability.y1[year] !== "NA" ? _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [0,ypos] + ")";
			});
		d3.selectAll(".disc-y.disc-2")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("transform",function(c){
				var year = +date - 1990,
					ypos = c.variability.y2[year] !== "NA" ? _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [0,ypos] + ")";
			});

		//if(type !== "lg"){
			d3.selectAll(".disc-x-line")
				/*.classed("hide",function(c){
					var year = +date - 1990,
						bubble_parent = d3.select(this.parentNode);
					if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" || type == "lg"){
						if(bubble_parent.classed("hide") === true){
							return true;
						}else{
							return false;
						}
					}else{
						return true;
					}
				})*/
				.transition()
				.duration(function(){
					if(!duration){
						if(slider === "fast"){
							return _main_transition.fast_duration;
						}else{
							return _main_transition.duration;
						}
					}else{
						return duration;
					}
				})
				.ease(_main_transition.ease)
				.attr("d",function(c){
					var bw = _chart["err-bar"],
						year = +date - 1990;
					if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && type !== "lg"){
						return 	"M" + 
									[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
								" Q" + 
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
									[0,0] + 
								" T" + 
									[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
					}
				});
		//}

		d3.selectAll(".disc-y-line")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
					if(bubble_parent.classed("hide") === true){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("d",function(c){
				var bw = _chart["err-bar"],
					year = +date - 1990;			
				if(c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					return 	"M" + 
								[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
								[0,0] + 
							" T" + 
								[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
				}
			});

		d3.selectAll(".disc-xy-line")
			/*.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
					if(bubble_parent.classed("hide") === true){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			})*/
			.transition()
			.duration(function(){
				if(!duration){
					if(slider === "fast"){
						return _main_transition.fast_duration;
					}else{
						return _main_transition.duration;
					}
				}else{
					return duration;
				}
			})
			.ease(_main_transition.ease)
			.attr("d",function(c){
				var bw = _chart["err-bar"],
					year = +date - 1990;
				
				if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE WITH X AND Y VALUES
					return 	"M" + 
								[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
								[0,0] + 
							" T" + 
								[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];

				}else if(c.variability.x1[year] === "NA" && c.variability.x2[year] === "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE BUT THEY BOTH MISS X VALUES
					return 	"M" + 
								[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
								[0,0] + 
							" T" + 
								[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
					
				}else if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] === "NA" && c.variability.y2[year] === "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE BUT THEY MISS Y VALUES
					return 	"M" + 
								[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
							" Q" + 
								[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
								[0,0] + 
							" T" + 
								[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];

				}else if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA"){
					// IF ONLY BUBBLE 2 IS AVAILABLE
					if(c.variability.x2[year] !== "NA" && c.variability.y2[year] !== "NA"){
						// IF BUBBLE 2 IS MISSING NOTHING
						return 	"M" +
									[0,0] + 
								" Q" +
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,-15] + " " +
									[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
					/*}else if(){
						// IF BUBBLE 2 IS MISSING X
					}else if(){
						// IF BUBBLE 2 IS MISSING Y*/
					}
				}else if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA"){
					// IF ONLY BUBBLE 1 IS AVAILABLE
					if(c.variability.x1[year] !== "NA" && c.variability.y1[year] !== "NA"){
						return 	"M" +
									[0,0] + 
								" Q" +
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " +
									[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])];
					}
				}

					/*else if(c.bubble_x[year] === "NA" && c.bubble_y[year] !== "NA"){
						return "M" + [0,0] + " C" + [0,-bw] + " " + [(_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]))/2,-15] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
					}else if(c.bubble_x[year] !== "NA" && c.bubble_y[year] == "NA"){
						return "M" + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + [0,bw] + " " + [0,0];
					}*/
				
			});



		/*d3.selectAll(".disc-line")
			.each(function(c){
				//console.log(c.variability)
				var year = +check_date() - 1990;
					bubble_x = c.bubble_x[year],
					bubble_y = c.bubble_y[year],
					bubble_exists = true,
					bubble_data = d3.select(this.parentNode).datum(),
					x_var = bubble_data.x_variance,
					y_var = bubble_data.y_variance,
					x1_exists = c.variability.x1[year] !== "NA" ? true : false,
					x2_exists = c.variability.x2[year] !== "NA" ? true : false,
					y1_exists = c.variability.y1[year] !== "NA" ? true : false,
					y2_exists = c.variability.y2[year] !== "NA" ? true : false;

				if(bubble_x === "NA" || bubble_y === "NA"){ bubble_exists = false; }

				if(!bubble_exists){
					//console.log("nothing here")
				} 

				//console.log(d3.select(this.parentNode).datum().x_variance,d3.select(this.parentNode).datum().y_variance)
			})*/
}

function update_bubbles_notransition(date,slider){

	var zoom = check_zoom(),
		isolationId = check_isolation(),
		type = get_chart_type();

	d3.selectAll(".bubble")
		.each(function(d){
			if(d3.sum(d.x) === 0 && d.x.indexOf("NA") !== -1 || d3.sum(d.y) === 0 && d.y.indexOf("NA") !== -1){
				d3.select(".entry-" + d.countryid)
					.select(".drill-down-country i")
					.attr("class","fa fa-circle-o");
			}
		})
		.attr("transform",function(d,i){
			var x_value = d.x[+date-1990],
				y_value = d.y[+date-1990];

			if(type === "lg"){
				if(i !== 0 && y_value === "NA"){
					var hold_values = d.y.slice(0);
					hold_values.forEach(function(c,i){
						if(i !== 0 && c === "NA"){
							return hold_values[i] = hold_values[i-1];
						}
					});
					y_value = hold_values[+date-1990];
				}
			};

			var entry = d3.select(".entry-" + d.countryid),
				originally_inactive = entry.classed("user-inactivated");

			if(entry.classed("non-existent") === false){
				if(zoom && originally_inactive === false){
					if(x_value === 0 || y_value === 0){
						entry.classed("inactive",true)
							.select("td:first-child")
								.html("&thinsp;&#10005");
					}else{
						entry.classed("inactive",false)
							//.classed("zoomed-out",false)
							.select("td:first-child")
								.html("<i class='fa fa-eye'></i>");
					}
				}else if(originally_inactive === false){
					entry.classed("inactive",false)
						.select("td:first-child")
							.html("<i class='fa fa-eye'></i>");
				}
			}else{
				entry.classed("inactive",false)
					.select("td:first-child")
						.html("<i class='fa fa-chain-broken'></i>");
			}

			if(x_value !== "NA"){
				var new_posx = _xscale(x_value);
			}else{
				var new_posx = - _svg.hpadding + _chart.sm_bubble_width + 2;
			}

			if(y_value !== "NA"){
				var new_posy = _yscale(y_value);
			}else{
				var new_posy = _svg.vpadding + _chart.height - _chart.sm_bubble_width - 2;
			}

			return "translate(" + [new_posx,new_posy] + ")";
		})
		.each(function(d){
			var bubble = d3.select(this),
				entry = d3.select(".entry-" + d.countryid),
				originally_inactive = entry.classed("user-inactivated");

			var x_value = d.x[+date-1990],
				y_value = d.y[+date-1990];


			bubble.select(".main-bubble")
				.attr("r",function(){
					if(x_value === "NA" || y_value === "NA"){
						return _chart.sm_bubble_width;
					}else if(type === "sp"){
						//console.log(d.x_variance,d.y_variance)
						if(d.x_variance !== "TOT" && d.x_variance.indexOf("TOT-") !== -1 || d.y_variance !== "TOT" && d.y_variance.indexOf("TOT-") !== -1){
							var variance_visible = check_variability_menu();
								if(variance_visible){
									return _chart["err-bar"];
								}else{
									return _chart.bubble_width;
								}
						}else{
							return _chart.bubble_width;
						}
					}else if(type === "lg"){
						if(d.y_variance !== "TOT"){
							return _chart["err-bar"];
						}else{
							return _chart.bubble_width;
						}
					}
				})
				.each(function(){
					var label_pos = determine_bubble_position(bubble),
						contour = bubble.select(".ctr-label-contour");

					if(contour.node()){
						box = { width: contour.attr("width")-20, height: contour.attr("height")-12 };
					}
					
					bubble.select(".ctr-label-text")
						.attr("y",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3 + box.height + 2;
							}else if(label_pos[1] === "middle"){
								return 5;
							}
						})
						.attr("x",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -_chart.bubble_width*3 - box.width/2 - 10; //-bbox.width - 20;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3 + box.width/2 + 10; //-bbox.
							}
						})

					bubble.select(".ctr-label-contour")
						.attr("x",function(){
							if(label_pos[0] === "center"){
								return -box.width/2 - 10;
							}else if(label_pos[0] === "left"){
								//console.log(box.width)
								return -_chart.bubble_width*3 - box.width - 20; //-bbox.width - 20;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3; //-bbox.
							}
						})
						.attr("y",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3 - box.height - 2;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3;
							}else if(label_pos[1] === "middle"){
								return -_chart.bubble_width;
							}
						});

					bubble.select(".ctr-label-line")
						.attr("x1",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -bubble.select(".main-bubble").attr("r");
							}else if(label_pos[0] === "right"){
								return bubble.select(".main-bubble").attr("r");
							}
						})
						.attr("y1",function(){
							if(label_pos[1] === "top"){
								return -bubble.select(".main-bubble").attr("r");
							}else if(label_pos[1] === "bottom"){
								return bubble.select(".main-bubble").attr("r");
							}else if(label_pos[1] === "middle"){
								return 0;
							}
						})
						.attr("x2",function(){
							if(label_pos[0] === "center"){
								return 0;
							}else if(label_pos[0] === "left"){
								return -_chart.bubble_width*3;
							}else if(label_pos[0] === "right"){
								return _chart.bubble_width*3;
							}
						})
						.attr("y2",function(){
							if(label_pos[1] === "top"){
								return -_chart.bubble_width*3;
							}else if(label_pos[1] === "bottom"){
								return _chart.bubble_width*3;
							}else if(label_pos[1] === "middle"){
								return 0;
							}
						});
				})

			/* ---- SET THE TEMPORAL LINE ---- */
			if(bubble.classed("highlight-lock") === true || type === "lg"){
				set_temporalline(d.countryid,d.region);
			}
		})

		/* ---- IF THERE IS UNCERTAINTY, UPDATE THE UNCERTAINTY MAP ---*/
		if(type !== "lg"){
			d3.selectAll(".x-bound")
				.attr("d",function(c){
					var year = +date - 1990;
					if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
						var bw = _chart["err-bar"];
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + 
						// ---- MID CURVE RIGHT SECTION HERE ---- //
						" C" + [bw,bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,-bw] + " " + [0,-bw] + " Z" + 
						// ---- LEFT SECTION HERE ---- //
						" M" + [0,bw] + " C" + [-bw,bw] + " " + [0,0] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0] + " C" + [0,0] + " " + [-bw,-bw] + " " + [0,-bw] + " " + 
						// ---- MID CURVE LEFT SECTION HERE ---- //
						 " C" + [-bw,-bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,bw] + " " + [0,bw]  + " Z";	
					}else{
						var bw = _chart.sm_bubble_width;
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,-bw] + " " + [0,-bw] + " Z";

					}
				})
		}

		d3.selectAll(".y-bound")
			.attr("d",function(c){
				var year = +date - 1990;
					if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
						var bw = _chart["err-bar"];
						return "M" + [bw,0] + " C" + [bw,-bw] + " " + [0,-bw] + " " + [0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + " C" + [0,-bw] + " " + [-bw,-bw] + " " + [-bw,0] + 
						// ---- MID CURVE RIGHT SECTION HERE ---- //
						" C" + [-bw,-bw] + " " + [0,-bw] + " " + [0,-bw] + " C" + [0,-bw] + " " + [bw,-bw] + " " + [bw,0] + " Z" + 
						// ---- LEFT SECTION HERE ---- //
						" M" + [bw,0] + " C" + [bw,bw] + " " + [0,bw] + " " + [0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])] + " C" + [0,bw] + " " + [-bw,bw] + " " + [-bw,0] + " " + 
						// ---- MID CURVE LEFT SECTION HERE ---- //
						" C" + [-bw,bw] + " " + [0,bw] + " " + [0,bw] + " C" + [0,bw] + " " + [bw,bw] + " " + [bw,0]  + " Z";
					}else{
						var bw = _chart.sm_bubble_width;
						return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
					}
			});

		// NEED TO UPDATE THE GENDER STUFF
		d3.selectAll(".disc-xy.disc-1")
			.attr("transform",function(c){
				var year = +date - 1990;
				var xpos = c.variability.x1[year] !== "NA" ? _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]) : 0,
					ypos = c.variability.y1[year] !== "NA" ? _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [xpos,ypos] + ")";
			});
		d3.selectAll(".disc-xy.disc-2")
			.attr("transform",function(c){
				var year = +date - 1990;
				var xpos = c.variability.x2[year] !== "NA" ? _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]) : 0,
					ypos = c.variability.y2[year] !== "NA" ? _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [xpos,ypos] + ")";
			});
		
		if(type !== "lg"){
			d3.selectAll(".disc-x.disc-1")
				.attr("transform",function(c){
					var year = +date - 1990,
						xpos = c.variability.x1[year] !== "NA" ? _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]) : 0;
						
					return "translate(" + [xpos,0] + ")";
				});
			d3.selectAll(".disc-x.disc-2")
				.attr("transform",function(c){
					var year = +date - 1990,
						xpos = c.variability.x2[year] !== "NA" ? _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]) : 0;
						
					return "translate(" + [xpos,0] + ")";
				});
		}

		d3.selectAll(".disc-y.disc-1")
			.attr("transform",function(c){
				var year = +date - 1990,
					ypos = c.variability.y1[year] !== "NA" ? _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [0,ypos] + ")";
			});
		d3.selectAll(".disc-y.disc-2")
			.attr("transform",function(c){
				var year = +date - 1990,
					ypos = c.variability.y2[year] !== "NA" ? _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]) : 0;
				return "translate(" + [0,ypos] + ")";
			});

			d3.selectAll(".disc-x-line")
				.attr("d",function(c){
					var bw = _chart["err-bar"],
						year = +date - 1990;
					if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && type !== "lg"){
						return 	"M" + 
									[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
								" Q" + 
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
									[0,0] + 
								" T" + 
									[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
					}
				});

		d3.selectAll(".disc-y-line")
			.attr("d",function(c){
				var bw = _chart["err-bar"],
					year = +date - 1990;			
				if(c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					return 	"M" + 
								[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
								[0,0] + 
							" T" + 
								[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
				}
			});

		d3.selectAll(".disc-xy-line")
			.attr("d",function(c){
				var bw = _chart["err-bar"],
					year = +date - 1990;
				
				if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE WITH X AND Y VALUES
					return 	"M" + 
								[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
								[0,0] + 
							" T" + 
								[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];

				}else if(c.variability.x1[year] === "NA" && c.variability.x2[year] === "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE BUT THEY BOTH MISS X VALUES
					return 	"M" + 
								[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
							" Q" + 
								[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
								[0,0] + 
							" T" + 
								[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
					
				}else if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] === "NA" && c.variability.y2[year] === "NA"){
					// IF BOTH BUBBLES ARE AVAILABLE BUT THEY MISS Y VALUES
					return 	"M" + 
								[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
							" Q" + 
								[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
								[0,0] + 
							" T" + 
								[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];

				}else if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA"){
					// IF ONLY BUBBLE 2 IS AVAILABLE
					if(c.variability.x2[year] !== "NA" && c.variability.y2[year] !== "NA"){
						// IF BUBBLE 2 IS MISSING NOTHING
						return 	"M" +
									[0,0] + 
								" Q" +
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,-15] + " " +
									[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];

					}
				}else if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA"){
					// IF ONLY BUBBLE 1 IS AVAILABLE
					if(c.variability.x1[year] !== "NA" && c.variability.y1[year] !== "NA"){
						return 	"M" +
									[0,0] + 
								" Q" +
									[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " +
									[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])];
					}
				}

				
			});
}

function check_variability(date,ux,uy,series_x,series_y,x_series,y_series,x_extent,y_extent,issoloed){
	/* ---- NEED TO LOAD THE DATA HERE ---- */
	var date = check_date(),
		type = get_chart_type(),
		variability_visible = check_variability_visible(),
		isolationId = check_isolation(),
		inactives = get_inactive_countries();

	rm_force_variability();

	if(ux && variability_visible === true || uy && variability_visible === true){
	//if(ux || uy){
		set_big_feedback_icon("fa-spin fa-spinner","n");


		var query = new Object();
		if(ux && !uy){
			query = { column: "SeriesRowId", value: ux.concat([0,0]), date: date };
		}else if(!ux && uy){
			query = { column: "SeriesRowId", value: [0,0].concat(uy), date: date };
		}else if(ux && uy){
			query = { column: "SeriesRowId", value: ux.concat(uy), date: date };
		}

		$.post("retrieveseries", 
			$.param(query, true)
		)
		.done(function(data){
			// ---- REMOVE THE LOADER ICON ---- //
			
			//rm_big_feedback_icon();
			var xs = { 
				"gmax": d3.max([data[0].gx_max,x_extent.gmax]),
				"gmin": d3.min([data[0].gx_min,x_extent.gmin]),
				"dmax": d3.max([data[0].dx_max,x_extent.dmax]),
				"dmin": d3.min([data[0].dx_min,x_extent.dmin])
			},
			ys = { 
				"gmax": d3.max([data[0].gy_max,y_extent.gmax]),
				"gmin": d3.min([data[0].gy_min,y_extent.gmin]),
				"dmax": d3.max([data[0].dy_max,y_extent.dmax]),
				"dmin": d3.min([data[0].dy_min,y_extent.dmin])
			};

			//console.log(xs)

			data = d3.nest()
				.key(function(d){ return d.CountryName; })
				.entries(data);

			var variability_map = data.map(function(d){
				var x_values_1 = new Array(25),
					x_values_2 = new Array(25),
					y_values_1 = new Array(25),
					y_values_2 = new Array(25),
					country_id, region;

				for(var j=0; j<26; j++){
					x_values_1[j] = "NA";
					x_values_2[j] = "NA";
					y_values_1[j] = "NA";
					y_values_2[j] = "NA";
				}
				
				var determine_x = "NA";

				d.values.map(function(c,i){
					country_id = c.CountryId;
					//console.log(c.Discrimination)
					//region = c.Region;
					//country_name = c.CountryName;
					//if(type === "sp"){
					if(ux){
						if(c.SeriesRowId === ux[0]){
							x_values_1[+c.Year-1990] = c.Value;
							x_disc_1 = c.Discrimination;
						}
						if(c.SeriesRowId === ux[1]){
							x_values_2[+c.Year-1990] = c.Value;
							x_disc_2 = c.Discrimination;
						}
					}
					if(uy){
						if(c.SeriesRowId === uy[0]){
							y_values_1[+c.Year-1990] = c.Value;
							y_disc_1 = c.Discrimination;
						}
						if(c.SeriesRowId === uy[1]){
							y_values_2[+c.Year-1990] = c.Value;
							y_disc_2 = c.Discrimination;
						}
					}
					/*}else if(type === "lg"){
						/* ---- WHAT WE WANT HERE IS THE INDEXES WHERE Y-VALUES ARE DIFFERENT FROM 0 ---- */
						/*if(c.axis === "y"){
							if(c.Value > 0){ determine_x = c.Year; }
							x_values[+c.Year-1990] = determine_x;
							y_values[+c.Year-1990] = c.Value;
						}*/
					//}
				});
				/* ---- NOW WE CONVERT THE INDEXES TO YEARS ---- */
				/*if(type === "lg"){
					x_values.forEach(function(b,i){
						if(i !== 0 && b === 0){
							return x_values[i] = x_values[i-1];
						}
					});
				}*/
				var obj = new Object;
				obj.countryid = country_id;
				if(ux){
					obj.x_disc_1 = x_disc_1;
					obj.x_disc_2 = x_disc_2;
				}
				if(uy){
					obj.y_disc_1 = y_disc_1;
					obj.y_disc_2 = y_disc_2;
				}

				if(ux){
					obj.x1 = x_values_1;
					obj.x2 = x_values_2;
				}
				if(uy){
					obj.y1 = y_values_1;
					obj.y2 = y_values_2;
				}

				return obj;
			});

			//console.log(variability_map)

			var zoom = check_zoom();

			if(ux){
				/*var x_scaledata = variability_map.map(function(d){
					var upp = d.x1.filter(function(c,i){ 
						return c !== "NA";
					});
					var low = d.x2.filter(function(c,i){ 
						return c !== "NA";
					});
					return upp.concat(low);
				});
				var m_x = new Array();
				m_x = m_x.concat.apply(m_x,x_scaledata);
				if(m_x.length === 0){ m_x = [0]; }*/

				if(type === "sp"){ // PB WITH ZOOM
					if(zoom && !isolationId){
						_xscale.domain([xs.dmin,xs.dmax])
						// FOR LOG SCALE
						//_xscale.domain([1,d3.max(m_x)])
						.range([0,_chart.width]);						
					}else if(!zoom && isolationId){
						//console.log(variability_map)
						var x_ext = variability_map.filter(function(d){
								return d.countryid === isolationId;
							}),
							year = +check_date() - 1990,
							bubble_data = d3.select(".bubble-" + isolationId).datum();
						_xscale.domain([d3.min([d3.min(x_ext[0].x1),d3.min(x_ext[0].x2),d3.min(bubble_data.x)]),d3.max([d3.max(x_ext[0].x1),d3.max(x_ext[0].x2),d3.max(bubble_data.x)])])
						// FOR LOG SCALE
						//_xscale.domain([1,d3.max(m_x)])
						.range([0,_chart.width]);
					}else if(!zoom && !isolationId){
						_xscale.domain([0,xs.gmax]) // [xs.gmin,xs.gmax]
						// FOR LOG SCALE
						//_xscale.domain([1,d3.max(m_x)])
						.range([0,_chart.width]);
					}
				}else if(type === "lg"){ // NEED TO FOCUS HERE LATER
					_xscale.domain([1990,2015])
					.range([0,_chart.width]);
				}
			}

			if(uy){
				/*var y_scaledata = variability_map.map(function(d){
					var upp = d.y1.filter(function(c,i){ 
							return c !== "NA";
						});
					var low = d.y2.filter(function(c,i){ 
							return c !== "NA";
						});
					return upp.concat(low);
				});
			
				var m_y = new Array();
				m_y = m_y.concat.apply(m_y,y_scaledata);
				if(m_y.length === 0){ m_y = [0]; }*/


				//_yscale.domain([d3.min(m_y),d3.max(m_y)])
				if(zoom && !isolationId){
					_yscale.domain([ys.dmin,ys.dmax])
					// FOR LOG SCALE
					//_yscale.domain([1,d3.max(m_y)])
					.range([_chart.height,0]);
				}else if(!zoom && isolationId){
					var y_ext = variability_map.filter(function(d){
							return d.countryid === isolationId;
						}),
						year = +check_date() - 1990,
						bubble_data = d3.select(".bubble-" + isolationId).datum();
					_yscale.domain([d3.min([d3.min(y_ext[0].y1),d3.min(y_ext[0].y2),d3.min(bubble_data.y)]),d3.max([d3.max(y_ext[0].y1),d3.max(y_ext[0].y2),d3.max(bubble_data.y)])])
					.range([_chart.height,0]);
				}else if(!zoom && !isolationId){
					_yscale.domain([0,ys.gmax]) //[ys.gmin,ys.gmax]
					// FOR LOG SCALE
					//_yscale.domain([1,d3.max(m_y)])
					.range([_chart.height,0]);
				}
			}



			//console.log(variability_map)
			
			variability_map.forEach(function(d){

				//console.log(d)

				var bubble = d3.select(".bubble-" + d.countryid);

				if(bubble.node()){
					var bubble_parent = d3.select(bubble.node().parentNode),
						bubble_parent_offset = d3.transform(bubble_parent.attr("transform")),
						bubble_data = bubble_parent.datum(),
						year = +date - 1990;

						//console.log(bubble_data.x_variance,bubble_data.y_variance)
						//bubble_x = bubble_data.x[year],
						//bubble_y = bubble_data.y[year];

					if(ux){
						bubble_data.gs.x.max = xs.gmax;
						bubble_data.gs.x.min = xs.gmin;
						bubble_data.ds.x.max = xs.dmax;
						bubble_data.ds.x.min = xs.dmin;
					}else if(uy){
						bubble_data.gs.y.max = xs.gmax;
						bubble_data.gs.y.min = xs.gmin;
						bubble_data.ds.y.max = xs.dmax;
						bubble_data.ds.y.min = xs.dmin;
					}

					/*"gs": { "x": { "max": x_gmax, "min": x_gmin }, "y": { "max": y_gmax, "min": y_gmin } }, "ds": { "x": { "max": x_dmax, "min": x_dmin }, "y": { "max": y_dmax, "min": y_dmin } } */
					//console.log(bubble_data.x_variance,bubble_data.y_variance)

					//var disparity_data = null;

					if(d.x1 && d.x2 && d.y1 && d.y2){
						//console.log("start here")
						if(bubble_data.x_variance === "TOT-MID" && bubble_data.y_variance === "TOT-MID"){

							// ---- FOR X ---- //
							bubble_parent.insert("path",":first-child")
								.datum({ variability: { x1: d.x1, x2: d.x2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","variability bounds x-bound")
								.attr("d",function(c){
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
										var bw = _chart["err-bar"];
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + 
										// ---- MID CURVE RIGHT SECTION HERE ---- //
										" C" + [bw,bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,-bw] + " " + [0,-bw] + " Z" + 
										// ---- LEFT SECTION HERE ---- //
										" M" + [0,bw] + " C" + [-bw,bw] + " " + [0,0] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0] + " C" + [0,0] + " " + [-bw,-bw] + " " + [0,-bw] + " " + 
										// ---- MID CURVE LEFT SECTION HERE ---- //
										" C" + [-bw,-bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,bw] + " " + [0,bw]  + " Z";
									}else{
										var bw = _chart.sm_bubble_width;
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
									}				
								});

								// ---- FOR Y ---- //
								bubble_parent.insert("path",":first-child")
									.datum({ variability: { y1: d.y1, y2: d.y2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
									.attr("class","variability bounds y-bound")
									.attr("d",function(c){
										if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											var bw = _chart["err-bar"];
											return "M" + [bw,0] + " C" + [bw,-bw] + " " + [0,-bw] + " " + [0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + " C" + [0,-bw] + " " + [-bw,-bw] + " " + [-bw,0] + 
											// ---- MID CURVE RIGHT SECTION HERE ---- //
											" C" + [-bw,-bw] + " " + [0,-bw] + " " + [0,-bw] + " C" + [0,-bw] + " " + [bw,-bw] + " " + [bw,0] + " Z" + 
											// ---- LEFT SECTION HERE ---- //
											" M" + [bw,0] + " C" + [bw,bw] + " " + [0,bw] + " " + [0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])] + " C" + [0,bw] + " " + [-bw,bw] + " " + [-bw,0] + " " + 
											// ---- MID CURVE LEFT SECTION HERE ---- //
											" C" + [-bw,bw] + " " + [0,bw] + " " + [0,bw] + " C" + [0,bw] + " " + [bw,bw] + " " + [bw,0]  + " Z";
										}else{
											var bw = _chart.sm_bubble_width;
											return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
										}
									});
						}else if(bubble_data.x_variance !== "TOT-MID" && bubble_data.y_variance === "TOT-MID"){
							// ---- FOR Y ---- //
							bubble_parent.insert("path",":first-child")
								.datum({ variability: { y1: d.y1, y2: d.y2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","variability bounds y-bound")
								.attr("d",function(c){
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
										var bw = _chart["err-bar"];
										return "M" + [bw,0] + " C" + [bw,-bw] + " " + [0,-bw] + " " + [0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + " C" + [0,-bw] + " " + [-bw,-bw] + " " + [-bw,0] + 
										// ---- MID CURVE RIGHT SECTION HERE ---- //
										" C" + [-bw,-bw] + " " + [0,-bw] + " " + [0,-bw] + " C" + [0,-bw] + " " + [bw,-bw] + " " + [bw,0] + " Z" + 
										// ---- LEFT SECTION HERE ---- //
										" M" + [bw,0] + " C" + [bw,bw] + " " + [0,bw] + " " + [0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])] + " C" + [0,bw] + " " + [-bw,bw] + " " + [-bw,0] + " " + 
										// ---- MID CURVE LEFT SECTION HERE ---- //
										" C" + [-bw,bw] + " " + [0,bw] + " " + [0,bw] + " C" + [0,bw] + " " + [bw,bw] + " " + [bw,0]  + " Z";
									}else{
										var bw = _chart.sm_bubble_width;
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
									}
								});
							// ---- THE GENDER STUFF ---- //
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: { x1: d.x1, x2: d.x2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds disc-x-line")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
											return 	"M" + 
														[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
													" Q" + 
														[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
														[0,0] + 
													" T" + 
														[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
										}
									}
							});

							variance1 = bubble_parent.insert("g",":nth-child(2)")
								.datum({ variability: { x1: d.x1, x2: d.x2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.x_disc_1 })
								.attr("class",function(c){
									if(c.variability.x1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-1 disc-x hide";
									}else{
										return "variability bounds disc-1 disc-x";
									}
								})
								.attr("transform",function(c){
									var xpos = 0;
									if(c.variability.x1[year] !== "NA"){
										xpos = _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]);
									}
									return "translate(" + [xpos,0] + ")";
								});
								
							variance1.append("circle")
								.attr("r",_chart.bubble_width);
								
							variance1.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "MEN" || c.disc === "BOY"){
										return "fa fa-mars";
									}else if(c.disc === "URB"){
										return "fa fa-industry";
									}
								});

							//console.log(d.x1,d.x2)

							variance2 = bubble_parent.insert("g",":nth-child(3)")
								.datum({ variability: { x1: d.x1, x2: d.x2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.x_disc_2 })
								.attr("class",function(c){
									if(c.variability.x2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-2 disc-x hide";
									}else{
										return "variability bounds disc-2 disc-x";
									}
								})
								.attr("transform",function(c){
									var xpos = 0;
									if(c.variability.x2[year] !== "NA"){
										xpos = _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]);
									}
									return "translate(" + [xpos,0] + ")";
								});
								
							variance2.append("circle")
								.attr("r",_chart.bubble_width);

							variance2.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "WMN" || c.disc === "GRL"){
										return "fa fa-venus";
									}else if(c.disc === "RUR"){
										return "fa fa-tree";
									}
								});

						}else if(bubble_data.x_variance === "TOT-MID" && bubble_data.y_variance !== "TOT-MID"){
						
							// ---- FOR X ---- //
							bubble_parent.insert("path",":first-child")
								.datum({ variability: { x1: d.x1, x2: d.x2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","variability bounds x-bound")
								.attr("d",function(c){
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
										var bw = _chart["err-bar"];
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + 
										// ---- MID CURVE RIGHT SECTION HERE ---- //
										" C" + [bw,bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,-bw] + " " + [0,-bw] + " Z" + 
										// ---- LEFT SECTION HERE ---- //
										" M" + [0,bw] + " C" + [-bw,bw] + " " + [0,0] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0] + " C" + [0,0] + " " + [-bw,-bw] + " " + [0,-bw] + " " + 
										// ---- MID CURVE LEFT SECTION HERE ---- //
										" C" + [-bw,-bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,bw] + " " + [0,bw]  + " Z";
									}else{
										var bw = _chart.sm_bubble_width;
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
									}				
								});

							// ---- THE GENDER STUFF ---- //
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: { y1: d.y1, y2: d.y2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds disc-y-line")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											//console.log("shit")
											return 	"M" + 
														[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
													" Q" + 
														[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
														[0,0] + 
													" T" + 
														[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
										}
									}
							});

							variance1 = bubble_parent.insert("g",":nth-child(2)")
								.datum({ variability: { y1: d.y1, y2: d.y2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.y_disc_1 })
								.attr("class",function(c){
									if(c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-1 disc-y hide";
									}else{
										return "variability bounds disc-1 disc-y";
									}
								})
								.attr("transform",function(c){
									var ypos = 0;
									if(c.variability.y1[year] !== "NA"){
										ypos = _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]);
									}
									return "translate(" + [0,ypos] + ")";
								});
								
							variance1.append("circle")
								.attr("r",_chart.bubble_width);
								
							variance1.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "MEN" || c.disc === "BOY"){
										return "fa fa-mars";
									}else if(c.disc === "URB"){
										return "fa fa-industry";
									}
								});

							variance2 = bubble_parent.insert("g",":nth-child(3)")
								.datum({ variability: { y1: d.y1, y2: d.y2 }, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.y_disc_2 })
								.attr("class",function(c){
									if(c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-2 disc-y hide";
									}else{
										return "variability bounds disc-2 disc-y";
									}
								})
								.attr("transform",function(c){
									var ypos = 0;
									if(c.variability.y2[year] !== "NA"){
										ypos = _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]);
									}
									return "translate(" + [0,ypos] + ")";
								});
								
							variance2.append("circle")
								.attr("r",_chart.bubble_width);

							variance2.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "WMN" || c.disc === "GRL"){
										return "fa fa-venus";
									}else if(c.disc === "RUR"){
										return "fa fa-tree";
									}
								});

						}else if(bubble_data.x_variance !== "TOT-MID" && bubble_data.y_variance !== "TOT-MID"){
							//console.log("but got here")
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds disc-xy-line")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											// IF BOTH BUBBLES ARE AVAILABLE WITH X AND Y VALUES
											return 	"M" + 
														[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
													" Q" + 
														[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
														[0,0] + 
													" T" + 
														[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];

										}else if(c.variability.x1[year] === "NA" && c.variability.x2[year] === "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											// IF BOTH BUBBLES ARE AVAILABLE BUT THEY BOTH MISS X VALUES
											return 	"M" + 
														[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
													" Q" + 
														[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
														[0,0] + 
													" T" + 
														[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
											
										}else if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] === "NA" && c.variability.y2[year] === "NA"){
											// IF BOTH BUBBLES ARE AVAILABLE BUT THEY MISS Y VALUES
											return 	"M" + 
														[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
													" Q" + 
														[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
														[0,0] + 
													" T" + 
														[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];

										}else if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA"){
											// IF ONLY BUBBLE 2 IS AVAILABLE
											if(c.variability.x2[year] !== "NA" && c.variability.y2[year] !== "NA"){
												// IF BUBBLE 2 IS MISSING NOTHING
												return 	"M" +
															[0,0] + 
														" Q" +
															[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,-15] + " " +
															[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
											/*}else if(){
												// IF BUBBLE 2 IS MISSING X
											}else if(){
												// IF BUBBLE 2 IS MISSING Y*/
											}
										}else if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA"){
											// IF ONLY BUBBLE 1 IS AVAILABLE
											if(c.variability.x1[year] !== "NA" && c.variability.y1[year] !== "NA"){
												return 	"M" +
															[0,0] + 
														" Q" +
															[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " +
															[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])];
											}
										}

										/*else if(c.bubble_x[year] === "NA" && c.bubble_y[year] !== "NA"){
											return "M" + [0,0] + " C" + [0,-bw] + " " + [(_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]))/2,-15] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
										}else if(c.bubble_x[year] !== "NA" && c.bubble_y[year] == "NA"){
											return "M" + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + [0,bw] + " " + [0,0];
										}*/
									}
								});

							variance1 = bubble_parent.insert("g",":nth-child(2)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc_x: d.x_disc_1, disc_y: d.y_disc_1 })
								.attr("class",function(c){
									//console.log(c.variability.x1[year] === "NA", c.variability.y1[year] === "NA", c.bubble_x[year] === "NA", c.bubble_y[year] === "NA")
									if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-1 disc-xy hide";
									}else{
										return "variability bounds disc-1 disc-xy";
									}
								})
								.attr("transform",function(c){
									var xpos = c.variability.x1[year] !== "NA" ? _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]) : 0,
										ypos = c.variability.y1[year] !== "NA" ? _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]) : 0;
									return "translate(" + [xpos,ypos] + ")";
								});
								
							variance1.append("circle")
								.attr("r",_chart.bubble_width);
								
							variance1.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc_x === "MEN" && c.disc_y === "MEN" || c.disc_x === "BOY" && c.disc_y === "BOY"){
										return "fa fa-mars";
									}else if(c.disc_x === "URB" && c.disc_y === "URB"){
										return "fa fa-industry";
									}else{
										alert("problem with icon in dispartiy")
									}
								});

							variance2 = bubble_parent.insert("g",":nth-child(3)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc_x: d.x_disc_2, disc_y: d.y_disc_2 })
								.attr("class",function(c){
									if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-2 disc-xy hide";
									}else{
										return "variability bounds disc-2 disc-xy";
									}
								})
								.attr("transform",function(c){
									//console.log(c.countryid,c.variability.x2[year],c.variability.y2[year])
									var xpos = c.variability.x2[year] !== "NA" ? _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]) : 0,
										ypos = c.variability.y2[year] !== "NA" ? _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]) : 0;
									//console.log(xpos,ypos)
									return "translate(" + [xpos,ypos] + ")";
								});
								
							variance2.append("circle")
								.attr("r",_chart.bubble_width);

							variance2.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc_x === "WMN" && c.disc_y === "WMN" || c.disc_x === "GRL" && c.disc_y === "GRL"){
										return "fa fa-venus";
									}else if(c.disc === "RUR" && c.disc_y === "RUR"){
										return "fa fa-tree";
									}else{
										alert("problem with disparity icons")
									}
								});

						/*}else if(bubble_data.x_variance !== "TOT-MID"){
							// ---- DO ONLY X
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											return 	"M" + 
														[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
													" Q" + 
														[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
														[0,0] + 
													" T" + 
														[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
										}
									}
							});*/
						/*}else if(bubble_data.y_variance !== "TOT-MID"){
							console.log("should be here")
							// ---- DO ONLY Y
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											return 	"M" + 
														[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
													" Q" + 
														[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
														[0,0] + 
													" T" + 
														[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
										}
									}
							});*/
						}

					}else if(d.x1 && d.x2 && !d.y1 && !d.y2){
						if(bubble_data.x_variance === "TOT-MID"){
						
							bubble_parent.insert("path",":first-child")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","variability bounds x-bound")
								.attr("d",function(c){
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
										var bw = _chart["err-bar"];
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + 
										// ---- MID CURVE RIGHT SECTION HERE ---- //
										" C" + [bw,bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,-bw] + " " + [0,-bw] + " Z" + 
										// ---- LEFT SECTION HERE ---- //
										" M" + [0,bw] + " C" + [-bw,bw] + " " + [0,0] + " " + [_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0] + " C" + [0,0] + " " + [-bw,-bw] + " " + [0,-bw] + " " + 
										// ---- MID CURVE LEFT SECTION HERE ---- //
										" C" + [-bw,-bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " + [-bw,bw] + " " + [0,bw]  + " Z";
									}else{
										var bw = _chart.sm_bubble_width;
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
									}				
								});
						}else{
							// SET GENDER BUBBLES HERE FOR X
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds disc-x-line")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.x1[year] !== "NA" && c.variability.x2[year] !== "NA"){
											return 	"M" + 
														[_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]),0] + 
													" Q" + 
														[(_xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]))/2,15] + " " + 
														[0,0] + 
													" T" + 
														[_xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]),0];
										}
									}
							});

							variance1 = bubble_parent.insert("g",":nth-child(2)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.x_disc_1 })
								.attr("class",function(c){
									if(c.variability.x1[year] === "NA" && c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-1 disc-x hide";
									}else{
										return "variability bounds disc-1 disc-x";
									}
								})
								.attr("transform",function(c){
									var xpos = 0;
									if(c.variability.x1[year] !== "NA" && c.bubble_x[year] !== "NA"){
										xpos = _xscale(c.variability.x1[year]) - _xscale(c.bubble_x[year]);
									}
									//if(isNaN(xpos)){ console.log(1,_xscale(c.variability.x1[year]),c.bubble_x[year]) }
									return "translate(" + [xpos,0] + ")";
								});
								
							variance1.append("circle")
								.attr("r",_chart.bubble_width);
								
							variance1.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "MEN" || c.disc === "BOY"){
										return "fa fa-mars";
									}else if(c.disc === "URB"){
										return "fa fa-industry";
									}
								});

							//console.log(d.x1,d.x2)

							variance2 = bubble_parent.insert("g",":nth-child(3)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.x_disc_2 })
								.attr("class",function(c){
									if(c.variability.x2[year] === "NA" && c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-2 disc-x hide";
									}else{
										return "variability bounds disc-2 disc-x";
									}
								})
								.attr("transform",function(c){
									var xpos = 0;
									if(c.variability.x2[year] !== "NA" && c.bubble_x[year] !== "NA"){
										xpos = _xscale(c.variability.x2[year]) - _xscale(c.bubble_x[year]);
									}
									//if(isNaN(xpos)){ console.log(2,_xscale(c.variability.x2[year]),c.bubble_x[year]) }
									return "translate(" + [xpos,0] + ")";
								});
								
							variance2.append("circle")
								.attr("r",_chart.bubble_width);

							variance2.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "WMN" || c.disc === "GRL"){
										return "fa fa-venus";
									}else if(c.disc === "RUR"){
										return "fa fa-tree";
									}
								});
						}

					}else if(!d.x1 && !d.x2 && d.y1 && d.y2){
						if(bubble_data.y_variance === "TOT-MID"){

							bubble_parent.insert("path",":first-child")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","variability bounds y-bound")
								.attr("d",function(c){
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA" && c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
										var bw = _chart["err-bar"];
										return "M" + [bw,0] + " C" + [bw,-bw] + " " + [0,-bw] + " " + [0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + " C" + [0,-bw] + " " + [-bw,-bw] + " " + [-bw,0] + 
										// ---- MID CURVE RIGHT SECTION HERE ---- //
										" C" + [-bw,-bw] + " " + [0,-bw] + " " + [0,-bw] + " C" + [0,-bw] + " " + [bw,-bw] + " " + [bw,0] + " Z" + 
										// ---- LEFT SECTION HERE ---- //
										" M" + [bw,0] + " C" + [bw,bw] + " " + [0,bw] + " " + [0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])] + " C" + [0,bw] + " " + [-bw,bw] + " " + [-bw,0] + " " + 
										// ---- MID CURVE LEFT SECTION HERE ---- //
										" C" + [-bw,bw] + " " + [0,bw] + " " + [0,bw] + " C" + [0,bw] + " " + [bw,bw] + " " + [bw,0]  + " Z";
									}else{
										var bw = _chart.sm_bubble_width;
										return "M" + [0,-bw] + " C" + [bw,-bw] + " " + [bw,0] + " " + [bw,0] + " C" + [bw,0] + " " + [bw,bw] + " " + [0,bw] + " C" + [-bw,bw] + " " + [-bw,0] + " " + [-bw,0] + " C" + [-bw,0] + " " +  [-bw,-bw] + " " + [-bw,0] + " Z";
									}
								});

						}else{
							// SET GENDER BUBBLES HERE FOR Y
							bubble_parent.insert("path",".main-bubble")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid })
								.attr("class","disc-line variability bounds disc-y-line")
								.attr("d",function(c){
									var bw = _chart["err-bar"];
									if(c.bubble_x[year] !== "NA" && c.bubble_y[year] !== "NA"){
										if(c.variability.y1[year] !== "NA" && c.variability.y2[year] !== "NA"){
											//console.log("shit")
											return 	"M" + 
														[0,_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year])] + 
													" Q" + 
														[15,(_yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]))/2] + " " + 
														[0,0] + 
													" T" + 
														[0,_yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year])];
										}
									}
							});

							variance1 = bubble_parent.insert("g",":nth-child(2)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.y_disc_1 })
								.attr("class",function(c){
									if(c.variability.y1[year] === "NA" && c.bubble_x[year] === "NA" ||c.bubble_y[year] === "NA"){
										return "variability bounds disc-1 disc-y hide";
									}else{
										return "variability bounds disc-1 disc-y";
									}
								})
								.attr("transform",function(c){
									var ypos = 0;
									if(c.variability.y1[year] !== "NA"){
										ypos = _yscale(c.variability.y1[year]) - _yscale(c.bubble_y[year]);
									}
									return "translate(" + [0,ypos] + ")";
								});
								
							variance1.append("circle")
								.attr("r",_chart.bubble_width);
								
							variance1.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "MEN" || c.disc === "BOY"){
										return "fa fa-mars";
									}else if(c.disc === "URB"){
										return "fa fa-industry";
									}
								});

							variance2 = bubble_parent.insert("g",":nth-child(3)")
								.datum({ variability: d, bubble_x: bubble_data.x, bubble_y: bubble_data.y, countryid: d.countryid, disc: d.y_disc_2 })
								.attr("class",function(c){
									if(c.variability.y2[year] === "NA" && c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA"){
										return "variability bounds disc-2 disc-y hide";
									}else{
										return "variability bounds disc-2 disc-y";
									}
								})
								.attr("transform",function(c){
									var ypos = 0;
									if(c.variability.y2[year] !== "NA"){
										ypos = _yscale(c.variability.y2[year]) - _yscale(c.bubble_y[year]);
									}
									return "translate(" + [0,ypos] + ")";
								});
								
							variance2.append("circle")
								.attr("r",_chart.bubble_width);

							variance2.append("foreignObject")
								.attr("width",30)
								.attr("height",30)
								.attr("x",-15)
								.attr("y",-15)
							.append("xhtml:body")
								.attr("class","fo-body variance-symbol")
							.append("i")
								.attr("class",function(c){
									if(c.disc === "WMN" || c.disc === "GRL"){
										return "fa fa-venus";
									}else if(c.disc === "RUR"){
										return "fa fa-tree";
									}
								});
						}
	

					}
				}
				// ---- HERE WE BIND THE BUBBLE TYPE ---- //
				//bubble_data.bubble_type = "err-bar";
				//bubble_data.variability = d;
				//console.log(bubble_data)
			});

			d3.selectAll(".main-bubble")
				.classed("err-bar",function(d){
					var x_value = d.x[+date-1990],
						y_value = d.y[+date-1990];
					if(x_value === 0 || y_value === 0){
						return false;
					}else{
						return true;
					}
				});

			d3.selectAll(".disc-y")
				.on("click",function(d){
					var year = +check_date() - 1990;
					console.log(d.variability.y1[year],d.variability.y2[year]);
				});

			if(type === "sp"){
				d3.selectAll(".x-bound").classed("hide",false);
				d3.selectAll(".disc-x").classed("hide",false);
				d3.selectAll(".disc-x-line").classed("hide",false);
			}else if(type === "lg"){
				d3.selectAll(".x-bound").classed("hide",true);
				d3.selectAll(".disc-x").classed("hide",true);
				d3.selectAll(".disc-x-line").classed("hide",true);
			}
				//.each(function(d){ return d.bubble_type = "err-bar" })

			//d3.select(".variability-menu").classed("hide",false);
			
			update_bubble_classes(date);

			if(type === "sp"){

				//if(!isolationId){
					set_correlation_line();
				//}

			}else if(type === "lg"){
				if(!isolationId){
					update_bubble_classes(date);
					var mean = get_stat_origindata("mean"),
						median = get_stat_origindata("median");
					
					//alert(d3.select(".show-median").classed("active"))

					if(d3.select(".show-mean").classed("active") === true){
						set_goal_line(mean,series_y.target,"mean");
						set_stat_line("mean");
						update_stat_line("mean");
					}
					if(d3.select(".show-median").classed("active") === true){
						set_goal_line(median,series_y.target,"median");
						set_stat_line("median");
						update_stat_line("median");
					}
				}else{
					//console.log(d3.selectAll(".main-bubble"));
					// REDO HERE SET THE TARGET LINE FOR SINGLE COUNTRY BASED ON data.y[0] / 2 (data FOR 1990/2 IF AVAILABLE FOR 1990)
					rm_goal_line();
					rm_stat_lines();

					var datum = d3.select(".bubble-" + isolationId).datum();
					set_goal_line(datum.y[0],series_y.target);
				}
			}


			if(inactives.length > 0){
				update_scales(date);
			}


			//console.log(series_x)
			update_axes(series_x.name,x_series,series_x.goal,series_y.name,y_series,series_y.goal,null,series_x.target,series_y.target);
			
			update_bubbles(date,null,null);
		});
	}else{
		/*d3.selectAll(".bubble")
			.classed("err-bar",false);*/
		//rm_variability_styling();
		d3.selectAll(".variability").remove();
		//d3.select(".variability-menu").classed("hide",true)
			//.classed("active",true);

		//d3.select(".variability-menu").html("Hide Disparity")

		if(type === "sp"){

			//if(!isolationId){
				set_correlation_line();
			//}

		}else if(type === "lg"){
			if(!isolationId){
				update_bubble_classes(date);
				var mean = get_stat_origindata("mean"),
					median = get_stat_origindata("median");
				
				//alert(d3.select(".show-median").classed("active"))

				if(d3.select(".show-mean").classed("active") === true){
					set_goal_line(mean,series_y.target,"mean");
					set_stat_line("mean");
					update_stat_line("mean");
				}
				if(d3.select(".show-median").classed("active") === true){
					set_goal_line(median,series_y.target,"median");
					set_stat_line("median");
					update_stat_line("median");
				}
			}else{
				//console.log(d3.selectAll(".main-bubble"));
				// REDO HERE SET THE TARGET LINE FOR SINGLE COUNTRY BASED ON data.y[0] / 2 (data FOR 1990/2 IF AVAILABLE FOR 1990)
				rm_goal_line();
				rm_stat_lines();

				var datum = d3.select(".bubble-" + isolationId).datum();
				set_goal_line(datum.y[0],series_y.target);
			}
		}

		
		if(inactives.length > 0){
			update_scales(date);
		};


		// RESET BUBBLE SIZE HERE
		/*d3.selectAll(".main-bubble:not(.missing-data)")
			.attr("r",_chart.bubble_width);*/
		//update_bubble_classes(date);
		//update_scales(date);
		//console.log(series_x)
		update_axes(series_x.name,x_series,series_x.goal,series_y.name,y_series,series_y.goal,null,series_x.target,series_y.target);
		update_bubbles(date,null);

	}

	if(issoloed){
		d3.select("button.x-label").classed("hide",true);
			
		d3.selectAll(".bubble")
			.classed("highlight-lock",true)
			.classed("soloed",true)
			.moveToFront();

			// ---- PLAY THE TIMELINE ---- //
			if(type === "lg" && date === 1990){
				setTimeout(function(){
					var bubble_len = d3.selectAll(".bubble")[0].length;
					if(bubble_len < 10){
						d3.selectAll(".main-bubble")
							.each(function(){
								return this["__onmouseover"]();
							});
					}
					return play_timeline(_main_transition.fast_duration,bubble_len);
				},_main_transition.fast_duration);
			}
		
		// ---- LOCK THE INTERACTIVE FEATURES ---- //
		var bubble_len = d3.selectAll(".bubble")[0].length;

		d3.select(".x.axis foreignObject").classed("lock",true);
		d3.select(".y.axis foreignObject").classed("lock",true);
		d3.select(".map-menu").classed("lock",true);
		d3.select(".stat-menu").classed("lock",true);

		if(bubble_len === 1){
			d3.select("#timeline").classed("lock",true);
		}else{
			d3.select("#timeline").classed("lock",false);
		}
		/*var lg = d3.select(".line-graph-tab")
				.classed("inactive",false);*/

		/*setTimeout(function(){
			//d3.select(".line-graph-tab")[0][0]["__onclick"]();
			d3.select(".bubble-" + sctr).node()["__onmouseover"]();
		},_main_transition.duration)*/
	}else{
		d3.select(".x.axis foreignObject").classed("lock",false);
		d3.select(".y.axis foreignObject").classed("lock",false);
		d3.select(".map-menu").classed("lock",false);

		d3.selectAll(".soloed").classed("soloed",false);
		d3.select("#timeline").classed("lock",false);
		update_bubble_classes(date);

		
		if(type === "lg" && date === 1990){

			setTimeout(function(){
				play_timeline(10);
			},_main_transition.duration);
		}
	}


}

function set_temporalline(idx,region){
	var svg = d3.select("#canvas"),
		year = check_date(),
		bubble = d3.select(".bubble-" + idx),
		bubble_parent = d3.select(bubble.node().parentNode),
		data = bubble.datum(),
		isolationId = check_isolation(),
		type = get_chart_type();

		//console.log(data.x[year-1990])
	//if(type === "lg"){ year = data.x[data.x.length-1] };

	//if(data.countryid === 430){ console.log(data.countryid) }

	var ts_data = new Array();
	for(var j=1990; j<=year; j++){
		//if(type === "sp"){
			//console.log(data.x)
			//if(data.x[j-1990] === 0){ data.x[j-1990] = "NA" };
			ts_data.push({ "x": data.x[j-1990], "y": data.y[j-1990] });
		/*}else if(type === "lg"){
			ts_data.push({ "x": j, "y": data.y[j-1990]});
		}*/
	}



	d3.selectAll(".ts-" + idx).remove();

	svg.append("g")
		.datum(ts_data)
		.attr("class",function(d){
			if(bubble_parent.classed("highlight-lock") === true){
				return "ts ts-" + idx + " ts-" + region;
			}else{
				return "no-highlight ts ts-" + idx + " ts-" + region;
			}
		})
		.classed("contextual",function(d){
			if(isolationId){
				if(data.countryid === isolationId){
					return false;
				}else{
					return true;
				}
			}else{
				return false;
			}
		})
		.classed("hide",function(d){
			if(bubble_parent.classed("hide") === true){
				return true;
			}else{
				return false;
			}
		})
		.each(function(d){
			var line_data = timeseries(d);
			//console.log(line_data)
			if(line_data){
				var segments = line_data.split("M");
					render_data = new Array();
				//console.log(segments)
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
					.attr("stroke-linecap","round")
					.attr("stroke-dasharray",function(d,i){
						if(i%2!==0){
							return "1,5";
						}else{
							return null;
						}
					})
					/*.style("stroke-width",function(d,i){
						if(i%2!==0){
							return 2;
						}else{
							return null;
						}
					})*/
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

function set_countrylabel(parent,d,dcode){
	
	var label_pos = determine_bubble_position(parent);

	rm(".label-" + dcode);
	rm_force_countrylabel(d3.selectAll(".bubble:not(.highlight-lock)"))

	var text = parent.insert("text",".main-bubble")
		.attr("class","ctr-label-text label-" + dcode)
		.attr("text-anchor","middle")
		.attr("x",0)
		.attr("y",0)
		.style("opacity",0)
		.text(d);

	var bbox = text.node().getBBox();

	text.transition()
		.duration(_main_transition.fast_duration)
		.ease("elastic-in")
		.attr("y",function(){
			if(label_pos[1] === "top"){
				return -_chart.bubble_width*3;
			}else if(label_pos[1] === "bottom"){
				return _chart.bubble_width*3 + bbox.height + 2;
			}else if(label_pos[1] === "middle"){
				return 5;
			}
		})
		.attr("x",function(){
			if(label_pos[0] === "center"){
				return 0;
			}else if(label_pos[0] === "left"){
				return -_chart.bubble_width*3 - bbox.width/2 - 10; //-bbox.width - 20;
			}else if(label_pos[0] === "right"){
				return _chart.bubble_width*3 + bbox.width/2 + 10; //-bbox.
			}
		})
		.style("opacity",1);

	var contour = parent.insert("rect","text")
		.attr("class","ctr-label-contour label-" + dcode)
		.attr("width",bbox.width + 20)
		.attr("height",bbox.height + 12)
		.attr("x",function(){
			return -bbox.width/2 - 10;
		})
		.attr("y",-bbox.height/2 - 6);

	contour.transition()
		.duration(_main_transition.fast_duration)
		.ease("elastic-in")
		.attr("x",function(){
			if(label_pos[0] === "center"){
				return -bbox.width/2 - 10;
			}else if(label_pos[0] === "left"){
				return -_chart.bubble_width*3 - bbox.width - 20; //-bbox.width - 20;
			}else if(label_pos[0] === "right"){
				return _chart.bubble_width*3; //-bbox.
			}
		})
		.attr("y",function(){
			if(label_pos[1] === "top"){
				return -_chart.bubble_width*3-bbox.height - 2;
			}else if(label_pos[1] === "bottom"){
				return _chart.bubble_width*3;
			}else if(label_pos[1] === "middle"){
				return -_chart.bubble_width;
			}
		});

	var line = parent.insert("line","rect")
		.attr("class","ctr-label-line label-" + dcode)
		.attr("x1",function(){
			if(label_pos[0] === "center"){
				return 0;
			}else if(label_pos[0] === "left"){
				return -parent.select(".main-bubble").attr("r");
			}else if(label_pos[0] === "right"){
				return parent.select(".main-bubble").attr("r");
			}
		})
		.attr("y1",function(){
			if(label_pos[1] === "top"){
				return -parent.select(".main-bubble").attr("r");
			}else if(label_pos[1] === "bottom"){
				return parent.select(".main-bubble").attr("r");
			}else if(label_pos[1] === "middle"){
				return 0;
			}
		})
		.attr("x2",function(){
			if(label_pos[0] === "center"){
				return 0;
			}else if(label_pos[0] === "left"){
				return -parent.select(".main-bubble").attr("r");
			}else if(label_pos[0] === "right"){
				return parent.select(".main-bubble").attr("r");
			}
		})
		.attr("y2",function(){
			if(label_pos[1] === "top"){
				return -_chart.bubble_width;
			}else if(label_pos[1] === "bottom"){
				return _chart.bubble_width;
			}else if(label_pos[1] === "middle"){
				return 0;
			}	
		});

	line.transition()
		.duration(_main_transition.fast_duration)
		.ease(_main_transition.ease)
		.attr("x2",function(){
			if(label_pos[0] === "center"){
				return 0;
			}else if(label_pos[0] === "left"){
				return -_chart.bubble_width*3;
			}else if(label_pos[0] === "right"){
				return _chart.bubble_width*3;
			}
		})
		.attr("y2",function(){
			if(label_pos[1] === "top"){
				return -_chart.bubble_width*3;
			}else if(label_pos[1] === "bottom"){
				return _chart.bubble_width*3;
			}else if(label_pos[1] === "middle"){
				return 0;
			}
		})
}


function set_timeline(animation_steps){

	$("#timeline").slider({
	    ticks: [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
	    ticks_labels: ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015"],
	    ticks_snap_bounds: 30
	})
	.on("slide",function(){
		var locked = d3.select(this).classed("lock");

		if(!locked){
			var x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId,
				year = check_date(),
				type = get_chart_type(),
				isolationId = check_isolation();
			//set_bubbles(x_series,y_series,year,"null_duration");
			rm_temporalline();

			update_bubble_classes(year);
			update_scales(year);
			update_bubbles(year,"null_duration");

			
			if(type === "sp"){
				update_correlation_line();
			}else if(type === "lg" && isolationId === undefined){
				update_stat_line("mean",0,year-1990);
				update_stat_line("median",0,year-1990);
			}

			d3.select("#play-btn").classed("active",false)
				.html("&#9658;");
			clearInterval(_play_interval);
		}
	})
	.on("slideStop",function(){
		var locked = d3.select(this).classed("lock");

		if(!locked){
			var x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId,
				year = check_date(),
				type = get_chart_type(),
				isolationId = check_isolation();

			rm_temporalline();
			//set_bubbles(x_series,y_series,year,"slow");
			update_bubble_classes(year);
			update_scales(year);
			update_bubbles(year,"slow");

			if(type === "sp"){
				update_correlation_line();
			}else if(type === "lg" && isolationId === undefined){
				update_stat_line("mean",null,year-1990);
				update_stat_line("median",null,year-1990);
			}

			d3.select("#play-btn").classed("active",false)
				.html("&#9658;");
			clearInterval(_play_interval);
		}else{
			var bubble_data = d3.select(".bubble").datum(),
				year = bubble_data.x[bubble_data.x.length-1];
			$("#timeline").slider().slider('setValue',year);
		}
	});
	d3.selectAll(".tooltip").remove();

	d3.select("#play-btn")
		.on("click",function(){
			var locked = d3.select("#timeline").classed("lock");
			if(!locked){
				return play_timeline();
			}
		})
}

function update_timeline(null_years){
	//console.log(null_years)
	var timeline = d3.select("#main-timeline"),
		timeline_ticks = d3.selectAll(".slider-tick"),
		play_btn = d3.select("#play-btn");
	
		/*timeline.classed("hide",false);
		play_btn.classed("hide",false);*/
		timeline_ticks.each(function(c,i){
				var node = d3.select(this);
				if(null_years.indexOf(i) !== -1){
					node.style("width","10px")
						.style("height","10px")
						.style("margin-left","-5px")
						.style("margin-top","-4px");
				}else{
					node.style("width",null)
						.style("height",null)
						.style("margin-left",null)
						.style("margin-top",null);
				}
			});
}

function set_goal_line(originvalue,target,label){
	//console.log(originvalue)
	var svg = d3.select("svg");

	//console.log(originvalue)
	// PB IF THE ORIGIN VALUE === "NA"

	var dividende = 1,
		description;

	if([1,2,10].indexOf(target) !== -1){
		dividende = 2;
		description = "halve (by 2015)";
	}else if(target === 5){
		dividende = 3;
		description = "reduce by two-thirds (by 2015)";
	}else if(target === 6){
		dividende = 4;
		description = "reduce by three-quarters (by 2015)";
	}

	target_g = svg.append("g")
		.attr("class",function(){
			if(label){
				return "target-val target-" + label;
			}else{
				return "target-val"
			}
		})
		.attr("transform","translate(" + [_svg.hpadding,_svg.vpadding/2 + _chart.height] + ")");

	target_g.append("rect")
		.attr("class","target-bg-salience")
		.attr("width",_chart.width)
		.attr("height",8)
		.attr("y",-4);

	var line = target_g.append("line")
		.attr("class","goal-line")
		.attr("stroke-dasharray","1,6")
		.attr("stroke-linecap","round")
		.attr("x1", 0)
		//.attr("y1", _yscale(originvalue/dividende))
		.attr("y1", 0)
		.attr("x2",	_chart.width)
		//.attr("y2", _yscale(originvalue/dividende));
		.attr("y2", 0);

	/*line.transition()
		.duration(_main_transition.duration)
		.ease(_main_transition.ease)
		.attr("x2",	_chart.width);*/

	target_g.append("text")
		.attr("x",5)
		//.attr("y", _yscale(originvalue/dividende) + 20)
		.attr("y", 20)
		.text(function(){
			if(label){
				return "Target: " + description + " [" + label + "]";
			}else{
				return "Target: " + description + ".";
			}
		});

	target_g.transition()
		.duration(_main_transition.duration)
		.ease(_main_transition.ease)
		.attr("transform","translate(" + [_svg.hpadding,_yscale(originvalue/dividende) + _svg.hpadding/2] + ")")
}

function set_stat_line(stat){
	var svg = d3.select("svg");
	stat_g = svg.append("g")
		.attr("class","stat " + stat)
		.attr("transform","translate(" + [_svg.hpadding,_svg.vpadding/2 + _chart.height] + ")");

	stat_g.append("rect")
		.attr("class","target-bg-salience")
		.attr("width",_chart.width)
		.attr("height",8)
		.attr("y",-4);

	stat_g.append("line")
		.attr("class","stat-line")
		//.attr("stroke-dasharray","10,10")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2",	_chart.width)
		.attr("y2", 0);

	var text = stat_g.append("text")
		.attr("class","stat-text")
		.attr("x",5)
		.attr("y", 20)
		.text("General " + stat); 

	var bbox = text.node().getBBox();

	stat_g.insert("rect",".stat-line")
		.attr("class","target-bg-salience")
		.attr("width",bbox.width + 10)
		.attr("height",bbox.height + 10);
}

function update_stat_line(stat,duration,date){
	var data = d3.selectAll(".bubble:not(.hide)").data();
	
	if(!date){
		var year = check_date(),
			date = year - 1990;
	}

	data = data.map(function(d,i){
		return d.y;
	}).filter(function(d){
		return d[date] !== "NA";
	});

	if(stat === "mean"){
		var value = d3.mean(data,function(d){ return d[date]; });
	}else if(stat === "median"){
		var value = d3.median(data,function(d){ return d[date]; });
	}


	return d3.select(".stat." + stat)
		.transition()
		.duration(function(){
			if(duration){
				return duration;
			}else{
				return _main_transition.duration
			}
		})
		.ease(_main_transition.ease)
		.attr("transform","translate(" + [_svg.hpadding,_yscale(value) + _svg.vpadding/2] + ")")
}

function set_correlation_line(){
	var svg = d3.select("svg"),
		data = d3.selectAll(".bubble").data(),
		date = check_date() - 1990;

	var corr_data = data.slice(0);

	data = data.map(function(d){
		return [d.x[date],d.y[date]];
	});

	data = data.filter(function(d){
		return d.indexOf("NA") === -1;
	});

	var xmax = _xscale.domain()[1];

	var reg = regression('linear', data),
		eq = reg.equation;

	var py1 = +eq[1],
		py2 = +eq[0] * xmax + eq[1];

	py1 = _yscale(py1);
	py2 = _yscale(py2);

	var correlation = Math.round(calcCORRELATION(corr_data,date)*100)/100;

	if(isNaN(correlation) === true){ 
		py1 = 0;
		py2 = 0;
		correlation = "no data"; 
	};

	stat_g = svg.append("g")
		.attr("class","correlation")
		.attr("transform","translate(" + [_svg.hpadding,_svg.vpadding/2] + ")");

	/*stat_g.append("rect")
		.attr("class","target-bg-salience")
		.attr("width",_chart.width)
		.attr("height",8)
		.attr("y",-4);*/

	stat_g.append("line")
		.attr("class","stat-line")
		.attr("x1", 0)
		.attr("y1", py1)
		.attr("x2",	_chart.width)
		.attr("y2", py2);

	stat_g.append("text")
		.attr("class","stat-text")
		.attr("x",5)
		.attr("y", 20)
		.text("Correlation r = " + correlation);
}

function update_correlation_line(){
	var svg = d3.select("svg"),
		data = d3.selectAll(".bubble").data(),
		date = check_date() - 1990;

	var corr_data = data.slice(0);

	data = data.map(function(d){
		return [d.x[date],d.y[date]];
	});

	data = data.filter(function(d){
		return d.indexOf("NA") === -1;
	});

	var xmax = _xscale.domain()[1];

	var reg = regression('linear', data),
		eq = reg.equation;

	var py1 = +eq[1],
		py2 = +eq[0] * xmax + eq[1];

	py1 = _yscale(py1);
	py2 = _yscale(py2);

	var correlation = Math.round(calcCORRELATION(corr_data,date)*100)/100;

	if(isNaN(correlation) === true){ 
		py1 = 0;
		py2 = 0;
		correlation = "no data"; 
	};

	stat_g = svg.select(".correlation");

	/*stat_g.append("rect")
		.attr("class","target-bg-salience")
		.attr("width",_chart.width)
		.attr("height",8)
		.attr("y",-4);*/

	stat_g.select("line")
		.transition()
		.duration(_main_transition.duration)
		.ease(_main_transition.ease)
		.attr("x1", 0)
		.attr("y1", py1)
		.attr("x2",	_chart.width)
		.attr("y2", py2);

	stat_g.select("text")
		.attr("x",5)
		.attr("y", 20)
		.text("Correlation: " + correlation);
}

function set_footer(){
	var footer = d3.select("#footer");

	footer.append("div")
		.attr("id","play-btn")
	.append("i")
		.attr("class","fa fa-play");

	footer.append("div")
		.attr("id","main-timeline")
	.append("input")
		.attr("id","timeline")
		.attr("type","text");
}