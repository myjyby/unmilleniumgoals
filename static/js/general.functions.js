d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};


Array.prototype.diff = function(a){
    return this.filter(function(i){return a.indexOf(i) < 0; });
};

function set_grand_tour(){
	d3.select(".fa-globe").classed("fa-spin",true);
	return set_first_question();
}

function set_visualization_environment(){
	d3.select("#header").classed("center",false)
		.html("<h1 class='major'>Is the world a better place today?<span class='pull-right'><a href='https://twitter.com/share' data-via='myjyby' target='_blank' data-hashtags='isWBPT'><i class='fa fa-twitter'></i></a></span></h1>");
	d3.select("#question-container").remove();
	d3.select("#container")
		.classed("hide",false);
	d3.select("#footer")
		.classed("hide",false);



	// ---- TWITTER SCRIPT ---- //
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');


	set_footer();
	set_svg();

	set_chart_tabs();

	// ---- SET THE SCATTERPLOT ---- //
	var lg = d3.select(".line-graph-tab")
		.classed("inactive",false);

	lg.select("line")
		.classed("hide",false);

	var sp = d3.select(".scatterplot-tab")
		.classed("inactive",true);

	sp.select("line")
		.classed("hide",true);

	set_axes();
	set_timeline();

	set_big_feedback_icon("fa-spin fa-spinner","n");

	return $.post("retrievecountries")
	.done(function(countries){
		console.log(countries)
		set_countrymenu(countries);
		rm_big_feedback_icon();
		set_bubbles(553,562,1990);

	});
}

function determine_bubble_position(node){
	var transformation = d3.transform(node.attr("transform")),
		xpos = transformation.translate[0],
		ypos = transformation.translate[1];

	var xorient = "center", 
		yorient = ypos < _svg.vpadding ? "bottom" : "top";
	if(xpos < 0){
		xorient = "right";
		yorient = "middle";
	}else if(xpos > _chart.width - _svg.hpadding/2){
		xorient = "left";
		yorient = "middle";
	}
	return [xorient,yorient];
}

function check_zoom(){
	var disabled = d3.select(".zoom-menu").select(".disabled");
	if(disabled.classed("zoom-in") === true){
		return "zoom";
	}else{
		return null;
	};
};

function set_big_feedback_icon(value,timeout){
	var svg = d3.select("svg");
	rm_force_big_feedback_icon();

	var fo = svg.append("foreignObject")
		.attr("class","big-feedback")
		.attr("width",200)
		.attr("height",200)
		.attr("x",_chart.width/2 - 100 + _svg.hpadding)
		.attr("y",_svg.height/2 - 125);

	var fo_body = fo.append("xhtml:body")
		.attr("class","fo-body feedback")
	.append("div")
		.attr("class","huge")
		.html("<i class='fa " + value + "'></i>");

	if(!timeout){
		rm_big_feedback_icon();
	}
}

function check_date(){
	return $("#timeline").slider().slider('getValue');
}

function show_region(region){
	var locked = d3.select(".map-menu").classed("lock");

	if(!locked){
		var is_original = d3.select(".country-picker-map").classed("original");

		if(is_original){

			if(d3.select("#" + region).classed("active") === false){
				d3.select("#world-map")
					.selectAll("g")
					.classed("highlight-lock",false)
					.classed("active",false);

				d3.select("#" + region)
					.classed("highlight-lock",true)
					.classed("active",true);

				d3.selectAll(".ctr-entry")
					.classed("hide",true);

				d3.selectAll(".entry-" + region)
					//.classed("highlight-lock",true)
					.classed("hide",false);
			}else{

				d3.select("#" + region)
					.classed("highlight-lock",false)
					.classed("active",false);
				
				d3.selectAll(".entry-" + region).classed("highlight-lock",false);
			}

		}else{
			var type = get_chart_type();

			if(d3.select("#world-map").selectAll("g").classed("inactive") === false){
				if(d3.select("#" + region).classed("active") === false){
					d3.select("#" + region)
						.classed("highlight-lock",true)
						.classed("active",true);
					d3.selectAll(".entry-" + region + ":not(.non-existent)")
						.classed("highlight-lock",true);
					d3.selectAll("." + region)
						.classed("highlight-lock",true)
						.moveToFront()
						.each(function(d){
							var bubble_parent = d3.select(this);
							set_temporalline(d.countryid,d.region);
							//return set_countrylabel(bubble_parent,d.country,d.countryid);

							var num_labels = check_numlabels();
							if(num_labels < 10){
								return set_countrylabel(bubble_parent,d.country,d.countryid);
							}else{
								rm_force_countrylabel();
							}
						});
				}else{
					/* ---- GET THE NUMBER OF LOCKED COUNTRIES
					BEFORE CHANGING THE STATE OF THIS ONE ---- */
					var original_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;

					d3.select("#" + region)
						.classed("highlight-lock",false)
						.classed("active",false);
					d3.selectAll(".entry-" + region).classed("highlight-lock",false);
					d3.selectAll("." + region)
						.classed("highlight-lock",false)
						.moveToFront()
						.each(function(d){
							var bubble_parent = d3.select(this);
							
							if(type !== "lg"){
								rm_temporalline(d.countryid);
							}else{
								d3.select(".ts-" + d.countryid)
									.classed("no-highlight",true);
							}
							
							return rm_check_countrylabel(bubble_parent);
						});

					/* ---- NOW GET THE NUMBER OF LOCKED COUNTRIES
					AFTER CHANGING THE STATE OF THIS ONE ---- */
					var final_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;

					/* --- HERE, IF THERE WAS ORIGINALLY MORE THAN
					TEN SELECTED COUNTRIES, AND THE USER DESLECTS THE 
					TENTH (LEAVING ONLY NINE), THEN ALL THE BUBBLE 
					LABBLES SHOULD POP UP AGAIN. FOR THIS, USE THE
					ORIGINAL AND FINAL LOCKS ---- */
					if(original_locks >= 10 && final_locks < 10){
						// ---- SHOW ALL BUBBLE LABELS ---- //
						d3.selectAll(".bubble.highlight-lock")
							.each(function(c){
								var bubble_parent = d3.select(this);
								return set_check_countrylabel(bubble_parent,c.country,c.countryid);
							});
					}
				}
			}
		}
	}
}

function check_numlabels(){
	return d3.selectAll(".ctr-entry.highlight-lock")[0].length;
}

function set_check_countrylabel(parent,d,dcode,conditionnode,condition){
	if(!condition){
		if(!parent.select(".ctr-label-text")[0][0]){
			return set_countrylabel(parent,d,dcode);
		}else{
			return null;
		}
	}else{
		if(conditionnode.classed(condition) === true){
			return null;
		}else{
			return set_countrylabel(parent,d,dcode);
		}
	}
}

function toggle_class(node,c,conditionnode,condition){
	if(!condition){
		if(node.classed(c) === true){
			return node.classed(c,false)
		}else{
			return node.classed(c,true)
		}
	}else{
		if(conditionnode.classed(condition) === true){
			return null;
		}else{
			if(node.classed(c) === true){
				return node.classed(c,false)
			}else{
				return node.classed(c,true)
			}
		}
	}
}

function toggle_html(node,before,after){
	if(node.html() === before){
		return node.html(after);
	}else{
		return node.html(before);
	}
}

function alternate_class(node,c1,c2){
	if(node.classed(c1) === true){
		node.classed(c1,false)
			.classed(c2,true);
	}else{
		node.classed(c2,false)
			.classed(c1,true);
	}
}

function check_isolation(){
	var node = d3.select(".isolated").node();
	if(node !== null){
		return d3.select(node).datum().CountryId;
	}else{
		return undefined;
	}
}

function check_soloed(){ // FOR THE VERY BEGINNING
	var node = d3.select(".soloed").node();
	if(node !== null){
		return true;
	}else{
		return false;
	}
}

function update_list_position(idx){
	var entry_position = $(".entry-" + idx).position().top,
		table_position = $(".ctr-list-menu table").offset().top;

	final_poisition = entry_position - table_position;

	return $(".ctr-list-menu").animate({
		scrollTop: final_poisition
	},_main_transition.very_fast_duration,"easeOutCubic");
}

function update_scales(date,duration,axes){
	//console.log("traverses this")
	var zoom = check_zoom(),
		map = d3.selectAll(".bubble:not(.hide)").data(),
		isolationId = check_isolation(),
		type = get_chart_type();

	if(type === "sp"){
		var map_bounds = d3.selectAll(".variability:not(.hide)").data();
	}else if(type === "lg"){
		var map_bounds = d3.selectAll(".variability").data();
	}

	var x_name = d3.select(".x-label").datum().SeriesName,
		y_name = d3.select(".y-label").datum().SeriesName,
		x_series = d3.select(".x-label").datum().SeriesRowId,
		y_series = d3.select(".y-label").datum().SeriesRowId,
		x_target = d3.select(".x-label").datum().TargetId,
		y_target = d3.select(".y-label").datum().TargetId,
		x_goal = d3.select(".x-label").datum().GoalId,
		y_goal = d3.select(".y-label").datum().GoalId;

	var bx_max = undefined;
		by_max = undefined;
		bx_min = undefined;
		by_min = undefined;


	/*map = map.filter(function(d){
		return d3.sum(d.x) !== 0 && d3.sum(d.y) !== 0;
	});*/
	/*map_bounds = map_bounds.map(function(d){
		console.log(d.countryid)
		if(d3.select(".bubble-" + d.countryid).classed("missing-data") === true){
			var bubble_data = d3.select(".bubble-" + d.countryid).datum();
			console.log(bubble_data)
		}
	});*/

	if(map_bounds.length > 0){
		if(isolationId){
			map_bounds = map_bounds.filter(function(d){
				return d.countryid === isolationId;
			})
		}
		map_bounds = map_bounds.map(function(d){
			//if(d.countryid === 156){ console.log("fuck china") }
			var xvals = new Array(),
				yvals = new Array();
			if(d.variability.x1 && d.variability.x2){
				if(zoom){
					xvals = [d.variability.x1[+date-1990],d.variability.x2[+date-1990]];
				}else{
					xvals = d.variability.x1.concat(d.variability.x2);
				}
			}
			if(d.variability.y1 && d.variability.y2){
				if(zoom){
					//console.log("her")
					yvals = [d.variability.y1[+date-1990],d.variability.y2[+date-1990]];
					//console.log(yvals)
					//console.log(yvals)
				}else{
					yvals = d.variability.y1.concat(d.variability.y2);
					/*console.log(d3.max(yvals))
					if(d3.max(yvals) === 2381) console.log("country" + d.countryid)*/
				}
			}
			xvals.remove("NA",true);
			yvals.remove("NA",true);
			//console.log(d3.max(yvals),d.countryid)
			return { x: xvals, y: yvals }
		})
		//map = map_bounds;
		bx_max = d3.max(map_bounds,function(d){ return d3.max(d.x); }),
		by_max = d3.max(map_bounds,function(d){ return d3.max(d.y); }),
		bx_min = d3.min(map_bounds,function(d){ return d3.min(d.x); }),
		by_min = d3.min(map_bounds,function(d){ return d3.min(d.y); });
		
	}

	//console.log(bx_min,bx_max)

	if(isolationId){
		map = map.filter(function(d){
			return d.countryid === isolationId;
		})
	}

	if(zoom){ // PROBLEM HERE WITH THE UPP LOW BOUNDS

		var x_scaledata = map.map(function(d){
			//if(d.y[+date-1990] !== "NA"){
				return d.x[+date-1990];
			//}else{
			//	return 0;
			//}
		});
		var y_scaledata = map.map(function(d){
			//if(d.x[+date-1990] !== "NA"){
				return d.y[+date-1990];
			//}else{
			//	return 0;
			//}
		});
		x_scaledata = x_scaledata.filter(function(d){
			return d !== "NA"; //> 0;
		});
		var x_max = d3.max(x_scaledata,(function(d){ return d })),
			x_min = d3.min(x_scaledata,(function(d){ return d }));
		y_scaledata = y_scaledata.filter(function(d){
			return d !== "NA"; //> 0;
		});
		var y_max = d3.max(y_scaledata,(function(d){ return d })),
			y_min = d3.min(y_scaledata,(function(d){ return d }));
		//console.log(y_min)
	}else{
		//console.log(map.length)
		var x_scaledata = map.map(function(d){
			return d.x.filter(function(c,i){ 
					return c !== "NA"; //>= 0;
				})
		});
		var x_max = d3.max(x_scaledata,(function(d){ return d3.max(d) })),
			x_min = 0;//d3.min(x_scaledata,(function(d){ return d3.min(d) }));
		
		var y_scaledata = map.map(function(d){
			return d.y.filter(function(c,i){ 
					return c !== "NA"; //>= 0;
				})
		});
		var y_max = d3.max(y_scaledata,(function(d){ return d3.max(d) })),
			y_min = 0;//d3.min(y_scaledata,(function(d){ return d3.min(d) }));
		//console.log(y_max)
	}		
	/*var m_x = new Array(),
		m_y = new Array();
	m_x = m_x.concat.apply(m_x,x_scaledata);
	m_y = m_y.concat.apply(m_y,y_scaledata);
	if(m_x.length === 0){ m_x = [0]; }
	if(m_y.length === 0){ m_y = [0]; }*/
	var fxmax = x_max, fxmin = x_min, fymax = y_max, fymin = y_min;
	
	//console.log(by_min)

	if(bx_max !== undefined && bx_max >= x_max){
		fxmax = bx_max;
	}
	if(bx_min !== undefined && bx_min <= x_min){
		fxmin = bx_min;
	}
	if(by_max !== undefined && by_max >= y_max){
		fymax = by_max;
		//console.log(by_max,y_max)
	}
	if(by_min !== undefined && by_min <= y_min){
		fymin = by_min;
	}
	//console.log(fymax)

	if(type === "sp"){
		_xscale.domain([fxmin,fxmax])
		// FOR LOG SCALE
		//_xscale.domain([1,d3.max(m_x)])
		.range([0,_chart.width]);
	}else if(type === "lg"){
		_xscale.domain([1990,2015])
		.range([0,_chart.width]);
	}

	_yscale.domain([fymin,fymax])
	// FOR LOG SCALE
	//_yscale.domain([1,d3.max(m_y)])
	.range([_chart.height,0]);

	if(zoom || axes){
		update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,duration,x_target,y_target);
	}
}

function get_null_years(data){
	//console.log(data[0].x.length)
	var all_years = new Array();
	for(var j=0; j< (2016-1990); j++){
		all_years[j] = new Array();
	}
	data.forEach(function(d){
		for(var h=0; h<d.x.length; h++){
			all_years[h].push(d.x[h] * d.y[h]);
		}
	});
	all_years = all_years.map(function(d,i){
		if(d3.sum(d) === 0){ return i; } /* ---- CHANGE HERE IF WE WANT TO GET YEARS WHERE NO DATA IS AVAILABLE ---- */
	}).filter(function(d){
		return d != undefined;
	});
	return all_years;
}


function get_unique_null_years(data){
	//console.log(data[0].x.length)
	var all_years = new Array();
	for(var j=0; j< (2016-1990); j++){
		all_years[j] = new Array();
	}
	//data.forEach(function(d){

	//console.log(data)
		for(var h=0; h<data.x.length; h++){
			all_years[h].push(data.x[h] * data.y[h]);
		}
	//});
	all_years = all_years.map(function(d,i){
		if(d3.sum(d) === 0){ return i; } /* ---- CHANGE HERE IF WE WANT TO GET YEARS WHERE NO DATA IS AVAILABLE ---- */
	}).filter(function(d){
		return d != undefined;
	});
	return all_years;
}

function get_notnull_years(data){
	var all_years = new Array();
	for(var j=0; j<data[0].x.length; j++){
		all_years[j] = new Array();
	}
	data.forEach(function(d){
		for(var h=0; h<d.x.length; h++){
			all_years[h].push(d.x[h] * d.y[h]);
		}
	});
	all_years = all_years.map(function(d,i){
		if(d3.sum(d) !== 0){ return i; } /* ---- CHANGE HERE IF WE WANT TO GET YEARS WHERE NO DATA IS AVAILABLE ---- */
	}).filter(function(d){
		return d != undefined;
	});
	return all_years;
}

function set_slider_data(data){
	// ---- CONVERT NULL YEARS INTO ACTUAL YEAR VALUES ---- //
	years = data.map(function(d){
		return d+1990;
	});
	var span = 2015-1990,
		step = 100/span;
	positions = data.map(function(d){
		return d*step;
	});

	return { ticks: years, ticks_labels: years.map(String), ticks_positions: positions,ticks_snap_bounds: 30 }
}

function get_chart_type(){
	return d3.select(".chart-type.inactive").attr("name");
}

function play_timeline(timestep,setquestion){
	var node = d3.select("#play-btn"),
		type = get_chart_type(),
		slider_step = 1000,
		data = d3.selectAll(".bubble").data();
		isolationId = check_isolation(),
		all_years = new Array(),
		zoom = check_zoom();

	if(isolationId){
		data = data.filter(function(d){
			return d.countryid === isolationId;
		});
	}
	var steps = get_notnull_years(data);

	year_steps = steps.map(function(d){
		return d+1990;
	});

	for(var j=1990; j<=2015; j++){
		all_years.push(j);
	}

	if(timestep){
		slider_step = timestep;
	}

	if(node.classed("active") === false){
		node.classed("active",true)
			.html("&thinsp;&#10005");
		//var year = $("#timeline").slider().slider('getValue');
		var increment = all_years.indexOf(check_date()),
			year = 1990;

			//increment = 0;
		/*if(year === year_steps[year_steps.length-1]){ 
			increment = -1;
		}*/

		_play_interval = setInterval(function(){
			increment ++;
			year = year_steps[increment];
			
			if(year === undefined){
				// ---- GET CLOSEST YEAR ---- //
				var closest = get_closest_number(check_date(),year_steps);
				increment = year_steps.indexOf(closest);
				if(closest <= check_date()){
					increment = increment+1;
				}
				if(increment > year_steps.length-1){
					increment = 0;
				}
				year = year_steps[increment];
			}

			// ---- THIS IS THE END OF THE ANIMATION ---- //
			if(year === year_steps[year_steps.length-1]){
				clearInterval(_play_interval);
				node.classed("active",false)
					.html("&#9658;");

				setTimeout(function(){
					if(setquestion === 1){
						set_response_field(0);
					}else if(setquestion > 1){
						set_response_field(3);
					}
				},_main_transition.duration);
			};
			$("#timeline").slider().slider('setValue',year);
			var x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId;

			//set_bubbles(x_series,y_series,year,"slow");
			if(!timestep){
				update_bubble_classes(year);
				update_scales(year);
				update_bubbles(year,"slow");
				
				if(type === "sp"){
					update_correlation_line();
				}else if(type === "lg"){
					update_stat_line("mean");
					update_stat_line("median");
				}
			}else{
				update_bubble_classes(year);
				//console.log("here")
				//update_scales(year,timestep);
				//update_bubbles_notransition(year,"slow",timestep);
				update_bubbles(year,"slow",timestep);
				if(type === "sp"){
					update_correlation_line();
				}else if(type === "lg"){
					update_stat_line("mean",timestep);
					update_stat_line("median",timestep);
				}
			}

			//console.log(year)
		}, slider_step);
	}else{
		node.classed("active",false)
			.html("<i class='fa fa-play'></i>");
		clearInterval(_play_interval);
	}
}

function get_closest_number(num, arr){
    curr = arr[0]
    arr.forEach(function(d){
        if(Math.abs(num - d) < Math.abs(num - curr)){
        	curr = d;
        }
    });
    return curr;
}

function check_variability_visible(){
	return d3.select(".variability-menu").classed("active");
}

function update_bubble_classes(date){
	var zoom = check_zoom(),
		isolationId = check_isolation(),
		type = get_chart_type();

	d3.selectAll(".bubble")
		.classed("contextual",function(d){
			if(isolationId){
				if(d.countryid === isolationId){
					return false;
				}else{
					return true;
				}
			}
		})
		.each(function(d){
			var bubble = d3.select(this),
				entry = d3.select(".entry-" + d.countryid),
				originally_inactive = entry.classed("user-inactivated"),
				originally_isolated = d3.selectAll(".soloed")[0].length,
				is_this_soloed = bubble.classed("soloed");


				
			var x_value = d.x[+date-1990],
				y_value = d.y[+date-1990];

			bubble.select(".main-bubble")
				.classed("missing-data",function(){
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
				});

			if(originally_isolated === 0){
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
			}else{
				if(is_this_soloed){
					bubble.classed("hide",false);
				}else{
					bubble.classed("hide",true);
				}
			}
		});

	d3.selectAll(".disc-xy.disc-1")
		.classed("hide",function(c){
			var year = +date - 1990,
				bubble_parent = d3.select(this.parentNode);
			if(c.variability.x1[year] === "NA" && c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
				return true;
			}else{
				return false;
			}
		});

	d3.selectAll(".disc-xy.disc-2")
		.classed("hide",function(c){
			var year = +date - 1990,
				bubble_parent = d3.select(this.parentNode);
			if(c.variability.x2[year] === "NA" && c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
				return true;
			}else{
				return false;
			}
		});

	if(type !== "lg"){
		d3.selectAll(".disc-x.disc-1")
			.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.x1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			});

		d3.selectAll(".disc-x.disc-2")
			.classed("hide",function(c){
				var year = +date - 1990,
					bubble_parent = d3.select(this.parentNode);
				if(c.variability.x2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || type == "lg" || bubble_parent.classed("hide") === true){
					return true;
				}else{
					return false;
				}
			});
	}

	d3.selectAll(".disc-y.disc-1")
		.classed("hide",function(c){
			var year = +date - 1990,
				bubble_parent = d3.select(this.parentNode);
			if(c.variability.y1[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
				return true;
			}else{
				return false;
			}
		});

	d3.selectAll(".disc-y.disc-2")
		.classed("hide",function(c){
			var year = +date - 1990,
				bubble_parent = d3.select(this.parentNode);
			if(c.variability.y2[year] === "NA" || c.bubble_x[year] === "NA" || c.bubble_y[year] === "NA" || bubble_parent.classed("hide") === true){
				return true;
			}else{
				return false;
			}
		});

	d3.selectAll(".disc-x-line")
		.classed("hide",function(c){
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
		});

	d3.selectAll(".disc-y-line")
		.classed("hide",function(c){
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
		});

	d3.selectAll(".disc-xy-line")
		.classed("hide",function(c){
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
		});
}

function get_inactive_countries(){
	var inactive_data = d3.selectAll(".user-inactivated").data();
	inactive_data = inactive_data.map(function(d){
		return d.CountryId;
	});
	return inactive_data;
}

function check_variability_menu(){
	var node = d3.select(".variability-menu");
	if(node.classed("active") === true){
		return true;
	}else{
		return false;
	}
}


function get_stat_origindata(stat){
	var data = d3.selectAll(".main-bubble").data();
	data = data.map(function(d,i){
		return d.y;
	});
	data = data.filter(function(d){
		return d[0] !== "NA";
	})
	if(stat === "mean"){
		return d3.mean(data,function(d){ return d[0]; });
	}else if(stat === "median"){
		return d3.median(data,function(d){ return d[0]; });
	}
}


function estimate_soloed_countries_achievement(answer){
	var bubbles = d3.selectAll(".bubble.soloed"),
		svg = d3.select("svg");
	// ---- GET NUMBER OF SOLOED BUBBLES ---- //
	var len = bubbles[0].length;
	
	if(len === 1){ // ---- THEN ESTIMATE ACHIEVEMENT FOR ONE COUNTRY
		var data = bubbles.data(),
			y_values = data[0].y;
			target = y_values[0]/2,
			not_null = get_notnull_years(data),
			last_data_available = data[0].x[not_null[not_null.length-1]];

		var targetId = d3.select(".y-label").datum().TargetId,
			dividende = 1;

		if([1,2,10].indexOf(targetId) !== -1){
			dividende = 2;
		}else if(targetId === 5){
			dividende = 3;
		}else if(targetId === 6){
			dividende = 4;
		}

		var target_val = y_values[0]/dividende;

		var intersect = new Array(),
			text = data[0].country + " had not reached its target by " + last_data_available + ", when data was last available.";

		not_null.forEach(function(d){
			if(data[0].y[d] < target_val){
				intersect.push({ x: data[0].x[d], y: data[0].y[d] });
			}
			return;
		});

		if(intersect.length > 0){
			svg.append("line")
				.attr("class","annotation-arrow")
				.attr("x1",_xscale(intersect[0].x) + _svg.hpadding)
				.attr("y1",_yscale(intersect[0].y) + _svg.vpadding/2)
				.attr("x2",_chart.width/2 + _svg.hpadding)
				.attr("y2",_chart.height/2)
				.attr("marker-start", "url(#markerArrow)");

			text = data[0].country + " reached its target for the first time in " + intersect[0].x + ".";
		}

		if(answer === true && intersect.length > 0 || answer === false && intersect.length === 0){
			var final_text = "<strong>Correct!</strong> <br>" + text;
		}else{
			var final_text = "<strong>Inorrect.</strong> <br>" + text;
		}


		feedback_fo = svg.append("foreignObject")
			.attr("class","textual-feedback")
			.attr("width", _chart.width/2)
			.attr("height", _chart.height/2)
			.attr("x", _svg.hpadding + _chart.width/2)
			.attr("y", 0);

		var feedback_fo_body = feedback_fo.append("xhtml:body")
			.attr("class","fo-body textual-feedback-body")
		.append("div")
			.attr("class","lock-bottom")
			.html(final_text);

		if(intersect.length > 0){
			return true;
		}else{
			return false;
		}

	}
}

function estimate_soloed_countries_achievement_proba(answer,value,trend,description,origin,prevans,y_offset){

	d3.selectAll(".annotation-arrow").remove();
	d3.selectAll(".textual-feedback").remove();

	var bubbles = d3.selectAll(".bubble.soloed"),
		svg = d3.select("svg");
	
	var data = bubbles.data(),
		y_values = data[0].y;
		target = y_values[0]/2,
		not_null = get_notnull_years(data),
		last_data_available = data[0].x[not_null[not_null.length-1]];

	//var intersect = new Array();

	if(prevans === false){
		var text = "It is " + value + " that " + data[0].country + " will have reached its target by today, as the general trend has " + description + " since " + origin + ".";
	}else{
		var text = data[0].country + " has <em>" + value + "</em> maintained its achievement untill today, as the general trend has " + description + " since " + origin + ".";
	}

	/*not_null.forEach(function(d){
		if(data[0].y[d] < target){
			intersect.push({ x: data[0].x[d], y: data[0].y[d] });
		}
		return;
	});

	if(intersect.length > 0){
		svg.append("line")
			.attr("class","annotation-arrow")
			.attr("x1",_xscale(intersect[0].x) + _svg.hpadding)
			.attr("y1",_yscale(intersect[0].y) + _svg.vpadding/2)
			.attr("x2",_chart.width/2 + _svg.hpadding)
			.attr("y2",_chart.height/2)
			.attr("marker-start", "url(#markerArrow)");

		text = data[0].country + " reached its target for the first time in " + intersect[0].x + ".";
	}*/

	if(answer === true){
		var final_text = "<strong>Correct!</strong> <br>" + text;
	}else{
		var final_text = "<strong>Inorrect.</strong> <br>" + text;
	}

	if(prevans === true){

	}else if(prevans === false && trend === -1){
		final_text = final_text + " However, if it has continued at the same rate, it will not have reached it."
	}

	feedback_fo = svg.append("foreignObject")
		.attr("class","textual-feedback")
		.attr("width", _chart.width/2)
		.attr("height", _chart.height)
		.attr("x", _svg.hpadding)
		.attr("y", _yscale(y_offset) - _chart.height + _svg.vpadding/2);

	var feedback_fo_body = feedback_fo.append("xhtml:body")
		.attr("class","fo-body textual-feedback-body")
	.append("div")
		.attr("class","lock-bottom")
		.html(final_text);

	/*if(intersect.length > 0){
		return true;
	}else{
		return false;
	}*/

}


function estimate_soloed_regions_achievement(answer,stat){
	var bubbles = d3.selectAll(".bubble"),
		svg = d3.select("svg");
	
	var data = bubbles.data(),
		y_values = data[0].y;
		target = y_values[0]/2,
		not_null = get_notnull_years(data),
		last_data_available = data[0].x[not_null[not_null.length-1]];

	var targetId = d3.select(".y-label").datum().TargetId,
		dividende = 1;

	var ydata = data.slice(0);
	ydata = ydata.map(function(d){
		return d.y;
	});

	var all_stats = new Array();
	for(var j=0; j<26; j++){
		if(stat === "mean"){
			all_stats.push(d3.mean(ydata,function(d){ return d[j]; }));
		}else if(stat === "median"){
			all_stats.push(d3.median(ydata,function(d){ return d[j]; }));
		}
	}

	if([1,2,10].indexOf(targetId) !== -1){
		dividende = 2;
	}else if(targetId === 5){
		dividende = 3;
	}else if(targetId === 6){
		dividende = 4;
	}

	var target_val = get_stat_origindata(stat)/dividende;

	all_stats = all_stats.map(function(d){
		var diff = d - target_val;
		if(d !== undefined){
			if(diff >= 0){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	});

	var intersect = all_stats.indexOf(true),
		text = "The <em>" + data[0].region_name + "</em> area had not reached its target by " + last_data_available + ", when data was last available.";

	if(intersect !== -1){
		var year = intersect + 1990;
		$("#timeline").slider().slider('setValue',year);
		update_bubble_classes(year);
		update_bubbles(year,"slow");
		
		update_stat_line(stat);

		text = "The <em>" + data[0].region_name + "</em> area reached its target for the first time in " + year + ".";
	}

	if(answer === true && intersect !== -1 || answer === false && intersect === -1){
		var final_text = "<strong>Correct!</strong> <br>" + text;
	}else{
		var final_text = "<strong>Inorrect.</strong> <br>" + text;
	}


	feedback_fo = svg.append("foreignObject")
		.attr("class","textual-feedback")
		.attr("width", _chart.width/2)
		.attr("height", _chart.height/2)
		.attr("x", _svg.hpadding + _chart.width/2)
		.attr("y", 0);

	var feedback_fo_body = feedback_fo.append("xhtml:body")
		.attr("class","fo-body textual-feedback-body")
	.append("div")
		.attr("class","lock-bottom")
		.html(final_text);

	if(intersect !== -1){
		return true;
	}else{
		return false;
	}

}

/*function leastSquares(xSeries, ySeries) {
	// ---- Based on http://bl.ocks.org/benvandyke/8459843
	var reduceSumFunc = function(prev, cur) { return prev + cur; };

	// ---- This is actually the mean ---- //
	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
		.reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
		.reduce(reduceSumFunc);
		
	var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
		.reduce(reduceSumFunc);
		
	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
	var pearson = ssXY/Math.sqrt(ssXX*ssYY);

	return [slope, intercept, rSquare, pearson];
}

function get_correlation(){
	var svg = d3.select("svg"),
		data = d3.selectAll(".bubble").data(),
		date = check_date() - 1990;

	var x_vector = new Array(),
		y_vector = new Array();

	data.forEach(function(d){
		if(d.x[date] !== "NA" && d.y[date] !== "NA"){
			x_vector.push(d.x[date]);
			y_vector.push(d.y[date]);
		}
	});



	var leastSquaresCoeff = leastSquares(x_vector, y_vector);
	//console.log(actual_leastSquaresCoeff)
	// ---- Draw the trendline ---- //
	var gx1 = d3.min(x_vector),
		gy1 = leastSquaresCoeff[0] * d3.min(x_vector) + leastSquaresCoeff[1],
		gx2 = d3.max(x_vector),
		gy2 = leastSquaresCoeff[0] * d3.max(x_vector) + leastSquaresCoeff[1];

	var line_data = [
		{ x1: _xscale(gx1), x2: _xscale(gx2), y1: _yscale(gy1), y2: _yscale(gy2) }
	]

	console.log(leastSquaresCoeff)

	return line_data;
}*/

function calcCORRELATION(data,date){
	// ---- Based on https://www.mathsisfun.com/data/correlation.html
	// ---- Get all values for X dimension ---- //
	data = data.filter(function(d){
		return d.x[date] !== "NA" && d.y[date] !== "NA";
	})

	var x_values = data.map(function(d){
		return d.x[date];
	})
	// ---- Get all values for Y dimension ---- //
	var y_values = data.map(function(d){
		return d.y[date];
	})

	console.log(x_values)

	var x_mean = d3.mean(x_values,function(d){ return +d; }),
		y_mean = d3.mean(y_values,function(d){ return +d; });

	var a = new Array(),
		b = new Array();

	x_values.forEach(function(d){
		a.push(+d - x_mean);
		return;
	});

	y_values.forEach(function(d){
		b.push(+d - y_mean);
		return;
	});

	var a_sq = new Array(),
		b_sq = new Array(),
		axb = new Array();
	for(var i=0; i<a.length; i++){
		axb.push(a[i] * b[i]);
		a_sq.push(a[i] * a[i]);
		b_sq.push(b[i] * b[i]);
	}
	var sum_axb = d3.sum(axb),
		sum_a_sq = d3.sum(a_sq),
		sum_b_sq = d3.sum(b_sq);
	var correlation = sum_axb/(Math.sqrt(sum_a_sq*sum_b_sq));
	return correlation;
}