function set_mainmenu(){
	return $.post("retrievedata", 
		$.param({ "colname": "Goal" }, true)
	)
	.done(function(goals){
		
		goals = goals.filter(unique);
		goals = rmna(goals);

		var ul = d3.select("#container")
			.append("ul");
		var li = ul.selectAll("li.goal")
			.data(goals);
		li.enter()
			.append("li")
			.attr("class","goal")
			.html(function(d){
				return d;
			})
			.on("mouseup",function(d){
				var parent = d3.select(this);
				rm(".target")

				$.post("retrievedata", 
					$.param({ "colname": "Target", "subset_key": "Goal", "subset_value": d }, true)
				)
				.done(function(targets){
					
					targets = targets.filter(unique);
					targets = rmna(targets);

					var ul = parent.append("ul");
					var li = ul.selectAll("li.target")
						.data(targets);
					li.enter()
						.append("li")
						.attr("class","target")
						.html(function(d){
							return d;
						})
						.on("mouseup",function(c){
							$.post("retrievedata", 
								$.param({ "subset_key": "Target", "subset_value": c }, true)
							)
							.done(function(data){

								data.forEach(function(d){
									var timeseries = new Array();
									for(var j=1990; j<=2015; j++){
										var value = d[j.toString()];
										if(value !== null){
											value = value.replace(/,/g, '.');
										}
										timeseries.push(+value);
									}
									d.timeseries = timeseries;
								});

								data = d3.nest()
									.key(function(d){ return d.SeriesCode })
									.key(function(d){ return d.Country })
									.entries(data);
							});
							d3.event.stopPropagation();
						});
				});
				d3.event.stopPropagation();
			});
	});
}

function set_countrymenu(countries){
	var svg = d3.select("svg");

	// ---- MAP MENU ---- //
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

	// ---- LIST MENU ---- //
	var fo = svg.append("foreignObject")
		.attr("class","country-picker-menu")
		.attr("width",_svg.width - _chart.width - _svg.hpadding)
		.attr("height",_chart.height - 160 + _svg.vpadding)
		.attr("x",_chart.width + _svg.hpadding)
		.attr("y",160 + _svg.vpadding/2);

	var fo_body = fo.append("xhtml:body")
		.attr("class","fo-body country-picker");	

	// ---- GLOBAL SELECTORS ---- //
	var selectors = fo_body.append("div")
		.attr("class","multiple-selectors")
	.append("table")
	.append("tr");

	selectors.append("td")
		.attr("class","general-selector-show show-all")
		.html("<i class='fa fa-eye'></i>")
		.on("mouseover",function(){
			var all_entries = d3.selectAll(".ctr-entry:not(.non-existent)"),
				eyes = all_entries.select(".show-country");
			return toggle_class(eyes,"highlight");
		})
		.on("mouseout",function(){
			var all_entries = d3.selectAll(".ctr-entry:not(.non-existent)"),
				eyes = all_entries.select(".show-country");
			return toggle_class(eyes,"highlight");
		})
		.on("click",function(d){
			var node = d3.select(this),
				sibling = d3.select(".general-selector-highlight"),
				all_entries = d3.selectAll(".ctr-entry:not(.non-existent)"),
				eyes = all_entries.select(".show-country"),
				names = all_entries.select(".highlight-country"),
				bubble_parent = d3.selectAll(".bubble"),
				map_regions = d3.select("#world-map")
					.selectAll("g");
			
			if(node.classed("show-all") === true){
				/* ---- THIS NEEDS TO BE APPLIED TO ALL EYES
				WHICH IS WHY WE DON'T PUT IT IN THE EACH FUNCITON ---- */
				eyes.classed("highlight",false);

				all_entries.classed("highlight-lock",false)
					.classed("inactive",true)
					.classed("user-inactivated",true);
					//.classed("highlight",true);
				eyes.html("&thinsp;&#10005");

				alternate_class(node,"show-all","hide-all");
				/* ---- NEED TO KEEP THIS (AND NOT USE toggle_class)
				BECAUSE THE USER CAN REACTIVATE INDIVIDUAL 
				COUNTRIES ---- */
				
				rm_force_countrylabel();
				bubble_parent.classed("highlight-lock",false)
					.classed("hide",true);

				rm_temporalline();

				d3.select(".correlation").classed("hide",true);
				d3.selectAll(".stat").classed("hide",true);
				d3.selectAll(".target-val").classed("hide",true);

				// ---- NEED TO REMOVE THE HIGHLIGHTS IN THE MAP ---- //
				map_regions.classed("highlight-lock",false)
					.classed("active",false);

				/* ---- NEED TO PREVENT SELECT ALL HERE ---- */
				sibling.classed("block",true)
					.classed("highlight-all",true)
					.classed("dim-all",false)
					.html("Select All Countries (" + countries.length + ")<span style='float:right;'><i class='fa fa-angle-down'></i></span>");
				
			}else{
				/* ---- NEED TO CHECK ZOOM HERE TO ENABLE ONLY THE
				VISIBLE COUNTRIES, I.E, THOSE NOT OUT OF RANGE ---- */
				var zoom = check_zoom(),
					type = get_chart_type();

				bubble_parent.each(function(d){
					var unique_bubble = d3.select(this),
						date = check_date(),
						x_value = d.x[+date-1990],
						y_value = d.y[+date-1990],
						unique_entry = d3.select(".entry-" + d.countryid + ":not(.non-existent)"),
						unique_eye = unique_entry.select(".show-country");

					if(zoom){
						if(x_value === 0 || y_value === 0){
							// Null
						}else{
							unique_bubble.classed("hide",false);
							unique_entry.classed("inactive",false);
								//.classed("highlight",false);
							unique_eye.html("<i class='fa fa-eye'></i>");
						}
					}else{
						unique_bubble.classed("hide",false);
						unique_entry.classed("inactive",false);
							//.classed("highlight",false);
						unique_eye.html("<i class='fa fa-eye'></i>");
					}

					if(type === "lg"){
						set_temporalline(d.countryid,d.region);
					}

				});

				alternate_class(node,"show-all","hide-all");
				sibling.classed("block",false);
				
				all_entries.each(function(){
					var local_node = d3.select(this);
					if(local_node.classed("non-existent") === false){
						local_node.classed("user-inactivated",false);
					}else{
						return null;
					}
				});

				var date = check_date(),
					x_name = d3.select(".x-label").datum().SeriesName,
					y_name = d3.select(".y-label").datum().SeriesName,
					x_series = d3.select(".x-label").datum().SeriesRowId,
					y_series = d3.select(".y-label").datum().SeriesRowId,
					x_target = d3.select(".x-label").datum().TargetId,
					y_target = d3.select(".y-label").datum().TargetId,
					x_goal = d3.select(".x-label").datum().GoalId,
					y_goal = d3.select(".y-label").datum().GoalId;

				if(type === "sp"){
					if(d3.select(".show-correlation").classed("active") === true){
						d3.select(".correlation").classed("hide",false);
					}
				}else if(type === "lg"){
					if(d3.select(".show-mean").classed("active") === true){
						d3.selectAll(".stat").classed("hide",false);
					}
					if(d3.select(".show-median").classed("active") === true){
						d3.selectAll(".target-val").classed("hide",false);
					}
				}

				update_bubble_classes(date);
				update_scales(date);
				update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);
				update_bubbles(date,null);

				if(type === "sp"){
					update_correlation_line();
				}else if(type === "lg"){
					update_stat_line("mean");
					update_stat_line("median");
				}

			}

			toggle_class(map_regions,"inactive");


			return toggle_html(node,"<i class=\"fa fa-eye\"></i>","&thinsp;&#10005");
		});

	selectors.append("td")
		.attr("class","general-selector-highlight highlight-all")
		.html("Select All Countries (" + countries.length + ") <span style='float:right;'><i class='fa fa-angle-down'></i></span>")
		.on("mouseover",function(){
			var node = d3.select(this),
				names = d3.selectAll(".ctr-entry:not(.non-existent)").select(".highlight-country");

			if(node.classed("block") === false){
				names.classed("highlight",true);
			} return
		})
		.on("mouseout",function(){
			var node = d3.select(this),
				names = d3.selectAll(".ctr-entry:not(.non-existent)").select(".highlight-country");
			return names.classed("highlight",false);
		})
		.on("click",function(d){
			var node = d3.select(this),
				bubble_parent = d3.selectAll(".bubble"),
				all_entries = d3.selectAll(".ctr-entry:not(.non-existent)"),
				names = all_entries.select(".highlight-country"),
				type = get_chart_type(),
				map_regions = d3.select("#world-map")
					.selectAll("g");
			
			if(node.classed("block") === false){
				
				if(node.classed("highlight-all") === true){
					node.html("Deselect All Countries (" + countries.length + ")<span style='float:right;'><i class='fa fa-angle-down'></i></span>");

					bubble_parent.classed("highlight-lock",true);
					all_entries.classed("highlight-lock",true);
						//.classed("hide",true);
					names.classed("highlight",false);

					map_regions.classed("highlight-lock",true)
						.classed("active",true);

					// ---- SHOW THE TEMPORAL LINES ---- //
					bubble_parent.each(function(d){
						return set_temporalline(d.countryid,d.region);
					});
				
				}else{
					node.html("Select All Countries (" + countries.length + ")<span style='float:right;'><i class='fa fa-angle-down'></i></span>");

					bubble_parent.classed("highlight-lock",false);
					all_entries.classed("highlight-lock",false);

					names.classed("highlight",true);

					map_regions.classed("highlight-lock",false)
						.classed("active",false);

					// ---- REMOVE THE TEMPORAL LINES ---- //
					if(type !== "lg"){
						//rm_temporalline(d.CountryId);
						//bubble_parent.each(function(d){
						rm_temporalline();
						//});
					}else{
						d3.selectAll(".ts")
							.classed("no-highlight",true);
					}
				}

				alternate_class(node,"highlight-all","dim-all");
				/* ---- FORCE REMOVE THE COUNTRY LABELS SINCE THE TOTAL NUMBER OF NODES WILL BE WELL ABOVE 10 ---- */
				rm_force_countrylabel();
			}
		});

	// ---- INDIVIDUAL SELECTORS ---- //
	var list_menu = fo_body.append("div")
			.attr("class","ctr-list-menu")
		.append("table");
	var list_entries = list_menu.selectAll("tr.ctr-entry")
		.data(countries);

	list_entries.enter()
		.append("tr")
		.attr("class",function(d){
			return 	"ctr-entry entry-" + 
					d.CountryId + 
					" entry-" + d.Region;
		})
		.on("mouseover",function(d){
			var node = d3.select(this);

			if(node.classed("non-existent") === false){

				var bubble = d3.select(".bubble-" + d.CountryId),
					bubble_parent = d3.select(bubble.node().parentNode),
					num_labels = check_numlabels();

				toggle_class(node,"highlight",node,"inactive");

				bubble_parent.moveToFront();

				if(num_labels < 10){
					return set_check_countrylabel(bubble_parent,d.CountryName,d.CountryId,node,"highlight-lock");
				}else{
					return set_check_countrylabel(bubble_parent,d.CountryName,d.CountryId)
				}

			}else{
				return null;
			}
		})
		.on("mouseout",function(d){
			
			var node = d3.select(this);

			if(node.classed("non-existent") === false){
			
				var bubble = d3.select(".bubble-" + d.CountryId),
					bubble_parent = d3.select(bubble.node().parentNode),
					num_labels = check_numlabels();

				toggle_class(node,"highlight",node,"inactive");

				if(num_labels >= 10 || node.classed("highlight-lock") === false){
					rm_check_countrylabel(bubble_parent);
				}
			}else{
				return null;
			}
		})

	list_entries.append("td")
		.attr("class","show-country")
		.html("<i class='fa fa-eye'></i>")
		/*.on("mousedown",function(){
			var parent = d3.select(this.parentNode);
			if(parent.classed("non-existent") === false){
				if(parent.classed("inactive") === false){
					parent.classed("highlight",false);
				}else{
					parent.classed("highlight",true);
				}
			}else{
				return null;
			}
		})*/
		.on("click",function(d){

			var node = d3.select(this)
				parent = d3.select(this.parentNode);

			if(parent.classed("non-existent") === false){

				var bubble = d3.select(".bubble-" + d.CountryId),
					bubble_parent = d3.select(bubble.node().parentNode),
					map_region = d3.select("#" + d.Region);

				if(parent.classed("inactive") === false){
					node.html("&thinsp;&#10005");
					parent.classed("highlight-lock",false);
						//.classed("highlight",false);

					bubble_parent.classed("highlight-lock",false)

					rm_force_countrylabel(bubble_parent);
					rm_temporalline(d.CountryId);

					if(d3.selectAll(".bubble." + d.Region + ".highlight-lock")[0][0] === undefined){
						map_region.classed("highlight-lock",false);
					}

					bubble_parent.selectAll(".variability").classed("hide",true);

				}else{
					node.html("<i class='fa fa-eye'></i>");
					
					setTimeout(function(){
						return parent.classed("highlight",true);
					},100);

					d3.select(".highlight-all").classed("block",false);
					bubble_parent.selectAll(".variability").classed("hide",false);

				}


				toggle_class(parent,"inactive");
				toggle_class(parent,"user-inactivated");
				toggle_class(bubble_parent,"hide");
				
				update_bubble_classes(check_date());
				update_scales(check_date(),null,true);
				update_bubbles(check_date());

				update_correlation_line();
			}else{
				return null;
			}
		});

	list_entries.append("td")
		.attr("class","highlight-country")
		.html(function(d){ return d.CountryName; })
		.on("click",function(d){

			var parent = d3.select(this.parentNode),
				type = get_chart_type();

			if(parent.classed("non-existent") === false){
				
				var bubble = d3.select(".bubble-" + d.CountryId),
					bubble_parent = d3.select(bubble.node().parentNode),
					map_region = d3.select("#" + d.Region);
				
				if(parent.classed("highlight-lock") === false && parent.classed("inactive") === false){
					toggle_class(parent,"highlight-lock",parent,"inactive");
					toggle_class(bubble_parent,"highlight-lock",parent,"inactive");
					
					set_temporalline(d.CountryId,d.Region);
					
					map_region.classed("highlight-lock",true);

				}else{
					/* ---- GET THE NUMBER OF LOCKED COUNTRIES
					BEFORE CHANGING THE STATE OF THIS ONE ---- */
					var original_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;

					toggle_class(parent,"highlight-lock",parent,"inactive");
					toggle_class(bubble_parent,"highlight-lock",parent,"inactive");

					/* ---- NOW GET THE NUMBER OF LOCKED COUNTRIES
					AFTER CHANGING THE STATE OF THIS ONE ---- */
					var final_locks = d3.selectAll(".ctr-entry.highlight-lock")[0].length;

					if(type !== "lg"){
						rm_temporalline(d.CountryId);
					}else{
						d3.select(".ts-" + d.CountryId)
							.classed("no-highlight",true);
					}

					if(d3.selectAll(".bubble." + d.Region + ".highlight-lock")[0][0] === undefined){
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
						set_check_countrylabel(bubble_parent,d.CountryName,d.CountryId);
					}

				}
				var num_labels = check_numlabels();
				if(num_labels >= 10){
					/* ---- REMOVE ALL LABELS BUT THE ONE
					THE MOUSE CURSOR IS STILL ON ---- */
					rm_force_countrylabel();
					set_check_countrylabel(bubble_parent,d.CountryName,d.CountryId);
				}
			}else{
				return null;
			}
		});

	list_entries.append("td")
		.attr("class","drill-down-country")
		.html("<i class='fa fa-bullseye'></i>")
		.on("click",function(d){

			//var year = check_date();
			// ---- HIDE ALL OTHER COUNTRY COUNTRIES ---- //
			var node = d3.select(this),
				parent = d3.select(this.parentNode),
				table = d3.select(this.parentNode.parentNode),
				bubble = d3.select(".bubble-" + d.CountryId),
				bubble_parent = d3.select(bubble.node().parentNode),
				datum = bubble_parent.datum(),
				all_entries = d3.selectAll(".ctr-entry"),
				map_region = d3.select("#" + d.Region),
				type = get_chart_type();

			if(node.select("i").classed("fa-circle-o") === false){
				if(parent.classed("isolated") === false){

					//node.attr("class","fa fa-reply");

					all_entries.classed("hide",true);
					parent.classed("hide",false)
						.classed("highlight-lock",true)
						.classed("isolated",true);
					bubble_parent.classed("highlight-lock",true);
					map_region.classed("highlight-lock",true);
					//toggle_class(parent,"highlight");

					// ---- REMOVE THE ZOOM ---- //
					d3.select(".zoom-in").classed("disabled",false);
					d3.select(".zoom-out").classed("disabled",true);

					d3.select(".stat-menu").classed("hide",true);


					node.select("i").attr("class","fa fa-circle");

					// ---- ADD THE REFRESH BUTTON ---- //
					var refresh = table.append("tr");
					refresh.append("td")
						.attr("class","show-country");
					refresh.append("td")
						.attr("class","refresh-all-countries")
						.html("<i class='fa fa-reply'></i>")
						/*.on("mouseover",function(){
							return d3.select(this).select("i")
								.classed("fa-spin",true);
						})
						.on("mouseout",function(){
							return d3.select(this).select("i")
								.classed("fa-spin",false);
						})*/
						.on("click",function(){
							//alert("here")
							node.select("i").attr("class","fa fa-bullseye");
							parent.classed("isolated",false);
							all_entries.classed("hide",false);

							rm_goal_line();

							d3.select(".stat-menu").classed("hide",false);


							var date = check_date(),
								type = get_chart_type(),
								x_name = d3.select(".x-label").datum().SeriesName,
								y_name = d3.select(".y-label").datum().SeriesName,
								x_series = d3.select(".x-label").datum().SeriesRowId,
								y_series = d3.select(".y-label").datum().SeriesRowId,
								x_target = d3.select(".x-label").datum().TargetId,
								y_target = d3.select(".y-label").datum().TargetId,
								x_goal = d3.select(".x-label").datum().GoalId,
								y_goal = d3.select(".y-label").datum().GoalId;

							//set_bubbles(x_series,y_series,year,"slow");
							update_bubble_classes(date);
							update_scales(date);
							update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);
							update_bubbles(date,null);

							update_list_position(d.CountryId);
							/*d3.selectAll(".drill-down-country")
								.select("i")
								.classed("fa fa-bullseye",true);*/
							if(type === "sp"){
								d3.select(".zoom-menu").classed("hide",false);	
								update_correlation_line();
							}else if(type === "lg"){
								d3.select(".zoom-menu").classed("hide",true);
								// CHECK HERE IF STAT IS ACTIVE
								set_stat_line("mean");
								update_stat_line("mean");

								update_bubble_classes(date);
								var mean = get_stat_origindata("mean");
								set_goal_line(mean,y_target);
								var median = get_stat_origindata("median");
								set_goal_line(median,y_target);
							}

							return d3.select(this).remove();
						});
					refresh.append("td")
						.attr("class","drill-down-country");

					d3.select(".zoom-menu").classed("hide",true);
					//set_bubbles(x_series,y_series,year);
					var date = check_date(),
						x_name = d3.select(".x-label").datum().SeriesName,
						y_name = d3.select(".y-label").datum().SeriesName,
						x_series = d3.select(".x-label").datum().SeriesRowId,
						y_series = d3.select(".y-label").datum().SeriesRowId,
						x_target = d3.select(".x-label").datum().TargetId,
						y_target = d3.select(".y-label").datum().TargetId,
						x_goal = d3.select(".x-label").datum().GoalId,
						y_goal = d3.select(".y-label").datum().GoalId;

					update_bubble_classes(date);
					update_scales(date);
					update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);
					update_bubbles(date,null);
					// NEED TO UPDATE THE TIMELINE HERE
					//console.log(d3.selectAll(".bubble").data())
					//console.log(datum)
					var null_years = get_unique_null_years(datum);
					update_timeline(null_years);

					// SHOW THE TARGET LINE
					//console.log(type,datum,d3.select(".y-label").datum())
					rm_goal_line();
					rm_stat_lines();
					if(type === "lg"){
						set_goal_line(datum.y[0],y_target);
					}
				
				}else{
					// ---- DO NOTHING ---- //
					//return node.attr("class","fa fa-bullseye");
				}
			}
		});

	var zoom_menu = fo_body.append("div")
		.attr("class","zoom-menu");

	zoom_menu.append("div")
		.attr("class","zoom-in")
		.html("<i class='fa fa-search-plus'></i>")
		/*.on("mousedown",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",true);
			}
		})
		.on("mouseup",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",false);
			}
		})*/
		.on("click",function(){
			if(_play_interval !== undefined){ 
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval);
			}
			if(d3.select(this).classed("disabled") === false){
				/*var x_series = d3.select(".x-label").datum().SeriesRowId,
					y_series = d3.select(".y-label").datum().SeriesRowId,
					year = check_date();*/
				//set_bubbles(x_series,y_series,year,null,"zoom");

				d3.select(".zoom-out").classed("disabled",false);
				d3.select(this).classed("disabled",true);

				var date = check_date(),
					x_name = d3.select(".x-label").datum().SeriesName,
					y_name = d3.select(".y-label").datum().SeriesName,
					x_series = d3.select(".x-label").datum().SeriesRowId,
					y_series = d3.select(".y-label").datum().SeriesRowId,
					x_target = d3.select(".x-label").datum().TargetId,
					y_target = d3.select(".y-label").datum().TargetId,
					x_goal = d3.select(".x-label").datum().GoalId,
					y_goal = d3.select(".y-label").datum().GoalId;

				update_bubble_classes(date);
				update_scales(date);
				update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);

				//update_bubble_classes(date);
				//update_scales(date);
				update_bubbles(date);

				update_correlation_line();

				set_big_feedback_icon("fa-search-plus");
			};
		});

	zoom_menu.append("div")
		.attr("class","zoom-out disabled")
		.html("<i class='fa fa-search-minus'></i>")
		/*.on("mousedown",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",true);
			}
		})
		.on("mouseup",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",false);
			}
		})*/
		.on("click",function(){
			if(_play_interval !== undefined){ 
				d3.select("#play-btn")
					.classed("active",false)
					.html("<i class='fa fa-play'></i>");
				clearInterval(_play_interval); 
			}
			if(d3.select(this).classed("disabled") === false){
				/*var x_series = d3.select(".x-label").datum().SeriesRowId,
					y_series = d3.select(".y-label").datum().SeriesRowId,
					year = check_date();*/
				//set_bubbles(x_series,y_series,year,null);

				d3.select(".zoom-in").classed("disabled",false);
				d3.select(this).classed("disabled",true);

				/*update_bubble_classes(year);
				update_scales(year);
				update_bubbles(year);*/

				var date = check_date(),
					x_name = d3.select(".x-label").datum().SeriesName,
					y_name = d3.select(".y-label").datum().SeriesName,
					x_series = d3.select(".x-label").datum().SeriesRowId,
					y_series = d3.select(".y-label").datum().SeriesRowId,
					x_target = d3.select(".x-label").datum().TargetId,
					y_target = d3.select(".y-label").datum().TargetId,
					x_goal = d3.select(".x-label").datum().GoalId,
					y_goal = d3.select(".y-label").datum().GoalId;

				update_bubble_classes(date);
				update_scales(date);
				update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);

				//update_bubble_classes(date);
				//update_scales(date);
				update_bubbles(date);

				update_correlation_line();

				set_big_feedback_icon("fa-search-minus");
			}
		});

	var variability_menu = fo_body.append("div")
		.attr("class","variability-menu hide active")
		.html("Hide Disparity")
		/*.on("mousedown",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",true);
			}
		})
		.on("mouseup",function(){
			if(d3.select(this).classed("disabled") === false){
				return d3.select(this).classed("active",false);
			}
		})*/
		.on("click",function(){
			var node = d3.select(this),
				x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId,
				year = check_date();
			toggle_class(node,"active");

			node.html(function(){
				if(node.classed("active") === true){
					return "Hide Disparity";
				}else{
					return "Show Disparity";
				}
			})
			//toggle_html(node,"Show Disparity","Hide Disparity");
			return set_bubbles(x_series,y_series,year,null);
		});

	set_stat_buttons();
}

function set_series_menu(position){
	var svg = d3.select("svg");

	d3.select("body")
		.on("click",function(){
			d3.selectAll(".series-picker-menu").remove();
			d3.selectAll(".axis-label button").classed("active",false);
		});

	set_big_feedback_icon("fa-spin fa-spinner","n");

	return $.post("retrieveindicators")
	.done(function(series){

		rm_big_feedback_icon();

		// ---- RESET HERE IF WE ONLY WANT THE AGGREGATED VALUES ---- //
		series = series.filter(function(d){
			return d["Disc-level"] === false;
		})
		//console.log(series)

		series = d3.nest()
			.key(function(d){ return d.GoalName; }).sortKeys(d3.ascending)
			.key(function(d){ return d.TargetName }).sortKeys(d3.ascending)
			.entries(series);

		var fo = svg.append("foreignObject")
			.attr("class","series-picker-menu")
			.attr("width",_picker_series.width)
			.attr("height",(series.length) * _picker_series.height)
			.attr("x",_svg.hpadding)
			.attr("y",_svg.height-_svg.vpadding-(series.length) * _picker_series.height);

		var fo_body = fo.append("xhtml:body")
			.attr("class","fo-body picker");

		var goals = fo_body.append("div")
				.attr("class","series-list list-goals " + position)
				.append("ul")
				.attr("class","series-list-container-l1");
		var goals_entries = goals.selectAll("li.goal")
				.data(series);
		goals_entries.enter()
			.append("li")
			.attr("class","series goal")
			.html(function(d){ 
				if(d.key.indexOf("Goal 1.") !== -1){
					var icon = "fa-money";
				}else if(d.key.indexOf("Goal 2.") !== -1){
					var icon = "fa-graduation-cap";
				}else if(d.key.indexOf("Goal 3.") !== -1){
					var icon = "fa-venus-mars";
				}else if(d.key.indexOf("Goal 4.") !== -1){
					var icon = "fa-child";
				}else if(d.key.indexOf("Goal 5.") !== -1){
					var icon = "fa-hospital-o";
				}else if(d.key.indexOf("Goal 6.") !== -1){
					var icon = "fa-medkit";
				}else if(d.key.indexOf("Goal 7.") !== -1){
					var icon = "fa-leaf";
				}else if(d.key.indexOf("Goal 8.") !== -1){
					var icon = "fa-globe";
				}

				return "<table><tr><td><i class='fa " + icon + "'></i></td><td>" + d.key + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>" 
			})
			.on("mouseover",function(d,i){

				var parent = d3.select(this),
					target_data = d.values;

				d3.selectAll("li.series.goal").classed("active",false);
				parent.classed("active",true);

				rm(".list-targets");
				rm(".list-series");


				var targets = fo_body.append("div")
						.attr("class","series-list list-targets " + position)
					.append("ul")
						.attr("class","series-list-container-l2");
				var targets_entries = targets.selectAll("li.target")
						.data(target_data);
				targets_entries.enter()
					.append("li")
					.attr("class","series target")
					.html(function(c){ 
						return "<table><tr><td>" + c.key + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>"; 
					})
					.on("mouseover",function(c,j){

						var parent = d3.select(this),
							indicator_data = c.values;
							//console.log(indicator_data)

						d3.selectAll("li.series.target").classed("active",false);
						parent.classed("active",true);

						rm(".list-series");

						var indicators = fo_body.append("div")
								.attr("class","series-list list-series " + position)
							.append("ul")
								.attr("class","series-list-container-l3")
						var indicators_entries = indicators.selectAll("li.series")
								.data(indicator_data);
						indicators_entries.enter()
							.append("li")
							.attr("class","series indicator")
							.html(function(b){
								return b.SeriesName; // + " " + b.IsMdg;
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
								//console.log(b.TargetId,b.IsMdg)
								return $.post("retrievedata", 
									$.param({ "colname": "SeriesRowId", "subset_key": "SeriesRowId", "subset_value": b.SeriesRowId }, true)
								)
								.done(function(code){

									code = code[0];
									//rm(".series-picker-menu");

									if(position === "abscisse"){
										var y_series = d3.select(".y-label").datum().SeriesRowId,
											year = check_date();
										return set_bubbles(code,y_series,year);
									}else{
										var x_series = d3.select(".x-label").datum().SeriesRowId,
											year = check_date();
										return set_bubbles(x_series,code,year);
									}
								});
							//alert("got one")
							});
						
					})
					.on("click",function(){
						return d3.event.stopPropagation();
					});
			})
			.on("click",function(){
				return d3.event.stopPropagation();
			});
	
	});
}

function set_chart_tabs(){
	var svg = d3.select("svg");

	var tab_container = svg.insert("g","#canvas")
		.attr("class","chart-tabs")
		.attr("transform","translate(" + [_svg.hpadding, 0] + ")");

	var sp = tab_container.append("g")
		.attr("class","chart-type scatterplot-tab")
		.attr("name","sp")
		.attr("transform","translate(" + [_chart.width/2,0] + ")")
		.on("click",function(){
			var node = d3.select(this),
				sibling = d3.select(".line-graph-tab"),
				line = node.select("line"),
				sibling_line = sibling.select("line"),
				x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId,
				year = check_date(),
				x_axis_button = d3.select("button.x-label");

			if(node.classed("inactive") === false){
				node.classed("inactive",true);
				sibling.classed("inactive",false);
				line.classed("hide",true);
				sibling_line.classed("hide",false);
				x_axis_button.classed("hide",false);

				// ---- ADD THE ZOOM BUTTONS AGAIN ---- //
				d3.select(".zoom-menu").classed("hide",false);

				//rm_all_bubbles();
				// CHANGE THE STAT BUTTONS
				set_stat_buttons();

				// ALSO NEEED TO REMOVE LINES 
				return set_bubbles(x_series,y_series,year);
			}
		});

	sp.append("rect")
		.attr("class","tab-bg-rect")
		.attr("width",_chart.width/2)
		.attr("height",_svg.vpadding/2);

	sp.append("path")
		.attr("d","M0,50 L0,0 L" + [_chart.width/2,0] + " L" + [_chart.width/2,50]);

	sp.append("line")
		//.attr("class","hide")
		.attr("x1",0)
		.attr("y1",50)
		.attr("x2",_chart.width/2)
		.attr("y2",50);

	sp.append("text")
		.attr("x",_chart.width/4)
		.attr("y",_svg.vpadding/4)
		.attr("dy",5)
		.attr("text-anchor","middle")
		.text("Scatterplot View");


	var lg = tab_container.append("g")
		.attr("class","chart-type line-graph-tab inactive")
		.attr("name","lg")
		//.attr("transform","translate(" + [_chart.width/2,0] + ")")
		.on("click",function(){
			var node = d3.select(this),
				sibling = d3.select(".scatterplot-tab"),
				line = node.select("line"),
				sibling_line = sibling.select("line"),
				x_series = d3.select(".x-label").datum().SeriesRowId,
				y_series = d3.select(".y-label").datum().SeriesRowId,
				year = check_date();
				x_axis_button = d3.select("button.x-label");

			if(node.classed("inactive") === false){
				node.classed("inactive",true);
				sibling.classed("inactive",false);
				line.classed("hide",true);
				sibling_line.classed("hide",false);
				x_axis_button.classed("hide",true);

				// ---- RESET THE ZOOM AND REMOVE THE BUTTONS ---- //
				d3.select(".zoom-in").classed("disabled",false);
				d3.select(".zoom-out").classed("disabled",true);
				d3.select(".zoom-menu").classed("hide",true);

				//rm_all_bubbles();
				// ALSO NEEED TO REMOVE LINES 
				set_bubbles(x_series,y_series,year);
				/*if(year === 1990){
					setTimeout(function(){
						play_timeline(10);
					},_main_transition.duration);
				}*/

				// ---- CHANGE THE STAT BUTTONS ---- //
				set_stat_buttons();
			}
		});

	lg.append("rect")
		.attr("class","tab-bg-rect")
		.attr("width",_chart.width/2)
		.attr("height",_svg.vpadding/2);

	lg.append("path")
		.attr("d","M0,50 L0,0 L" + [_chart.width/2,0] + " L" + [_chart.width/2,50]);

	lg.append("line")
		.attr("class","hide")
		.attr("x1",0)
		.attr("y1",50)
		.attr("x2",_chart.width/2)
		.attr("y2",50);

	lg.append("text")
		.attr("x",_chart.width/4)
		.attr("y",_svg.vpadding/4)
		.attr("dy",5)
		.attr("text-anchor","middle")
		.text("Line Graph View");
}

function set_stat_buttons(){
	var svg = d3.select("svg"),
		type = get_chart_type();

	// ---- RESET BUTTONS ---- //
	rm_stat_bubbtons();

	var fo = svg.append("foreignObject")
		.attr("class","stat-picker-menu")
		.attr("width",_svg.width - _chart.width - _svg.hpadding)
		.attr("height",_svg.vpadding/2)
		.attr("x",_chart.width + _svg.hpadding)
		.attr("y",0);

	var fo_body = fo.append("xhtml:body")
		.attr("class","fo-body stat-picker");

	var stat_menu = fo_body.append("div")
		.attr("class","stat-menu");

	
	if (type === "sp"){
		stat_menu.append("div")
			.attr("class","show-correlation active")
			.html("<i class='fa fa-line-chart'></i>&nbsp;&nbsp;&nbsp;Correlation")
			.on("mousedown",function(){

			})
			.on("mouseup",function(){

			})
			.on("click",function(){
				var node = d3.select(this);
				if(node.classed("lock") === false){
					toggle_class(node,"active");
					toggle_class(d3.select(".correlation"),"hide");
					//toggle_class(d3.select(".target-mean"),"hide");
				}
			});

	}else if(type === "lg"){
		stat_menu.append("div")
			.attr("class","show-mean active")
			.html("<i class='fa fa-line-chart'></i>&nbsp;&nbsp;&nbsp;Mean")
			.on("mousedown",function(){

			})
			.on("mouseup",function(){

			})
			.on("click",function(){
				var node = d3.select(this);
				if(node.classed("lock") === false){
					toggle_class(node,"active");
					toggle_class(d3.select(".stat.mean"),"hide");
					toggle_class(d3.select(".target-mean"),"hide");
				}
			});

		stat_menu.append("div")
			.attr("class","show-median active")
			.html("<i class='fa fa-line-chart'></i>&nbsp;&nbsp;&nbsp;Median")
			.on("mousedown",function(){

			})
			.on("mouseup",function(){

			})
			.on("click",function(){
				var node = d3.select(this);
				if(node.classed("lock") === false){
					toggle_class(node,"active");
					toggle_class(d3.select(".stat.median"),"hide");
					toggle_class(d3.select(".target-median"),"hide");
				}
			});
	}

}