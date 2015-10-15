var questions = [
	{
		//q: "Has this country reached the Millenium Development Goal set by the United Nations?",
		q: "So, has this region reached its goal for being a better place?",
		a: ["Yes","No"]
	},
	{
		q: "Based on the chart, when do you think this country will achieve the goal?",
		a: ["This year (2015)","In the next five years","In the next ten years","It needs much more time","Never"]
	}
]

function set_first_question(){
	// ---- PREVENT SCROLL BEHAVIOR ---- //
	/*d3.select("#wraper")
		.on("mousewheel",function(){
			//d3.event.preventDefault();
		})*/

	//[580,581,559,569,553,665,668,591]

	return $.post("retrieveindicators",
			$.param({ ids: [580,559,553,665,668] }, true)
		)
	.done(function(series){

	
		series = d3.nest()
			.key(function(d){ return d.GoalName; }).sortKeys(d3.ascending)
			.key(function(d){ return d.TargetName }).sortKeys(d3.ascending)
			.entries(series);

		// ---- RESEST THE HEADER ---- //
		d3.select("#header").classed("center",false)
			.html("<h1 class='major'>Is the world a better place today?");

		var container = d3.select("#question-container")
				.classed("hide",false);

		container.append("h1")
			.attr("class","minor quesiton")
			.html("Well, that dependends on the criterion. <br/><em>Have we managed to:</em>");

		var headers = container.append("div")
			.attr("class","picker headers");

		var headers_data = ["High level goals", "Targets", "Indicators for measuring achivement"];

		var header_cells = headers.selectAll(".header-cell")
			.data(headers_data)
		.enter()
			.append("div")
			.attr("class","header-cell")
			.html(function(d){ return d; });

		var fo_body = container.append("div")
			.attr("class","fo-body picker original");

		var goals = fo_body.append("div")
			.attr("class","series-list list-goals")
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

				var text = d.key.split(". ")[1];

				return "<table><tr><td><i class='fa " + icon + "'></i></td><td>" + text + "?</td><td><i class='fa fa-angle-right'></i></td></tr></table>" 
			})
			.on("mouseover",function(d,i){

				var parent = d3.select(this),
					target_data = d.values;

				d3.selectAll("li.series.goal").classed("active",false);
				parent.classed("active",true);

				rm(".list-targets");
				rm(".list-series");


				var targets = fo_body.append("div")
						.attr("class","series-list list-targets")
					.append("ul")
						.attr("class","series-list-container-l2");
				var targets_entries = targets.selectAll("li.target")
						.data(target_data);
				targets_entries.enter()
					.append("li")
					.attr("class","series target")
					.html(function(c){ 
						var text = c.key.split(": ")[1];
						return "<table><tr><td>" + text + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>"; 
					})
					.on("mouseover",function(c,j){

						var parent = d3.select(this),
							indicator_data = c.values;

						d3.selectAll("li.series.target").classed("active",false);
						parent.classed("active",true);

						rm(".list-series");

						var indicators = fo_body.append("div")
								.attr("class","series-list list-series")
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
							.on("mouseover",function(b){
								var parent = d3.select(this);
								d3.selectAll("li.series.indicator").classed("active",false);
								parent.classed("active",true);
							})
							.on("mouseout",function(){
								var parent = d3.select(this);
								parent.classed("active",false);
							})
							.on("click",function(b){
								/*container.append("i")
									.attr("class","fa fa-arrow-down");*/
								set_second_question(b.SeriesRowId);
							});
						
					})
					.on("click",function(){
						return d3.event.stopPropagation();
					});
			})
			.on("click",function(){
				return d3.event.stopPropagation();
			});

		/*goals.append("h2")
			.attr("class","goal-opt")
			.html(function(d){
				var text = d.key.split(". ")[1],
					subtext = d.values[0].key.split(": ")[1];
				return text + "?";//", by " + subtext.toLowerCase() + "?";
			})
			
		goals.on("click",function(d){

			d3.selectAll(".target-opt")
				.remove();

			var node = d3.select(this),
				targets = node.selectAll(".target-opt")
					.data(d.values);

			targets.enter()
				.append("div")
				.attr("class","target-opt");

			targets.append("h3")
				.attr("class","target-opt")
				.html(function(d){
					var text = d.key.split(": ")[1];
					return text + "?";
				})

		})*/
	});

}

function set_second_question(seriesId){
	var container = d3.select("#question-container")
			.html("");

	var question = container.append("h1")
		.attr("class","minor quesiton in")
		.html("In which part of the world, and in which country?");

	return $.post("retrievecountriesin1990",
		{ 'seriesId': seriesId }
		)
	.done(function(countries){
		set_svg();
		d3.select("#container").classed("hide",false);
		set_region_picker(countries,seriesId);		
		return question.classed("in",false);
	});

	/*setTimeout(function(){
		return question.classed("in",false);
	},1)*/
}

function set_region_picker(countries,seriesId){
	var svg = d3.select("svg");

	// ---- MAP MENU ---- //
	var map_menu = svg.append("g")
		.attr("class","map-menu")
		.attr("transform","translate(" + [0 + 25,0] + ")");

	map_menu.append("rect")
		.attr("width",_svg.width - _chart.width - _svg.hpadding - 25)
		.attr("height", 150)
		.attr("x",_svg.hpadding - 25)
		.attr("y",_svg.vpadding/2);

	var map_fo = map_menu.append("foreignObject")
		.attr("class","country-picker-map original")
		.attr("width",_svg.width - _chart.width - _svg.hpadding - 25)
		.attr("height", 150)
		.attr("x",_svg.hpadding - 25)
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
		.attr("x",_svg.hpadding - 25)
		.attr("y",160 + _svg.vpadding/2);

	var fo_body = fo.append("xhtml:body")
		.attr("class","fo-body country-picker");	

	// ---- GLOBAL SELECTORS ---- //
	/*var selectors = fo_body.append("div")
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
				eyes.classed("highlight",false);

				all_entries.classed("highlight-lock",false)
					.classed("inactive",true)
					.classed("user-inactivated",true);
					//.classed("highlight",true);
				eyes.html("&thinsp;&#10005");

				alternate_class(node,"show-all","hide-all");
				
				rm_force_countrylabel();
				bubble_parent.classed("highlight-lock",false)
					.classed("hide",true);

				rm_temporalline();

				// ---- NEED TO REMOVE THE HIGHLIGHTS IN THE MAP ---- //
				map_regions.classed("highlight-lock",false)
					.classed("active",false);


				sibling.classed("block",true)
					.classed("highlight-all",true)
					.classed("dim-all",false)
					.html("Select All Countries (" + countries.length + ")<span style='float:right;'><i class='fa fa-angle-down'></i></span>");
				
			}else{

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

				update_bubble_classes(date);
				update_scales(date);
				update_axes(x_name,x_series,x_goal,y_name,y_series,y_goal,null,x_target,y_target);
				update_bubbles(date,null);

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
				rm_force_countrylabel();
			}
		});*/

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
			return toggle_class(node,"highlight",node,"inactive");
		})
		.on("mouseout",function(d){
			var node = d3.select(this);
			return toggle_class(node,"highlight",node,"inactive");
		})

	/*list_entries.append("td")
		.attr("class","show-country")
		.html("<i class='fa fa-eye'></i>")
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
			}else{
				return null;
			}
		});*/

	list_entries.append("td")
		.attr("class","highlight-country no-padding-left")
		.html(function(d){ return d.CountryName; })
		.on("click",function(d){
		

			d3.select("#question-container")
				.html("")
				.classed("hide",true);
			d3.select("svg").remove();

			d3.select("#footer")
				.classed("hide",false);


			set_footer();
			set_svg();

			set_chart_tabs();

			var sp = d3.select(".scatterplot-tab");
			sp.select("path").classed("hide",true);
			sp.select("rect").classed("hide",true);
			sp.select("text").classed("hide",true);

			set_axes();
			set_timeline();

			set_big_feedback_icon("fa-spin fa-spinner","n");

			$.post("retrievecountriesin1990",
				{ 'seriesId': seriesId }
			)
			.done(function(countries){

				rm_big_feedback_icon();

				set_countrymenu(countries);

				d3.select("#" + d.Region).classed("highlight-lock",true);

				d3.selectAll(".ctr-entry:not(.entry-" + d.CountryId + ")")
					.classed("hide",true);

				d3.select(".entry-" + d.CountryId)
					.classed("isolated",true)
					.classed("highlight-lock",true);
					//.classed("original-isolation",true);

				d3.select(".zoom-menu")
					.classed("hide",true);

				d3.select(".stat-menu")
					.classed("hide",true);

				set_bubbles(553,seriesId,1990,true,d.CountryId);

			});

		});
}

function set_response_field(qidx,prevans){
	var svg = d3.select("svg"),
		question = [
			"So, has this country already reached its target (at least temporarily—based on available data)?", 
			/* IF YES */ 	"Do you think it will have maintained its achievement?", 
			/* IF NO */		"Do you think it will have reached its target by 2015 (today)?",
			/* FOR AGGREGATION */	"So, has this area reached its target (at least temporarily—despite any missing data)?"
		],
		answers = [
			[
				{ 	
					text: "Yes, it has", 
					value: true 
				},
				{ 	
					text: "No, it has not", 
					value: false 
				}
			],
			[
				{
					text: "Most likely",
					value: 0
				},
				{
					text: "Likely",
					value: 1
				},
				{
					text: "Unlikely",
					value: 2
				},
				{
					text: "Most unlikely",
					value: 3
				}
				/*{
					text: "It is impossible to tell",
					value: 4
				}*/
			],
			[
				{
					text: "Most likely",
					value: 0
				},
				{
					text: "Possibly",
					value: 1
				},
				{
					text: "Unlikely",
					value: 2
				},
				{
					text: "Most unlikely",
					value: 3
				}
				/*{
					text: "It is impossible to tell",
					value: 4
				}*/
			],
			[
				{ 	
					text: "Yes, it has", 
					value: true 
				},
				{ 	
					text: "No, it has not", 
					value: false 
				}
			]
		]

	d3.select(".question-box").remove();
	d3.select("div.ctr-list-menu table").classed("hide",true);

	if(qidx === 1 && prevans === false){
		qidx = 2;
	}

	var response_fo = svg.append("foreignObject")
		.attr("class","question-box")
		.attr("width",_svg.width - _chart.width - _svg.hpadding)
		.attr("height",_chart.height - 160)
		.attr("x",_chart.width + _svg.hpadding + (_svg.width - _chart.width - _svg.hpadding))
		.attr("y",160 + _svg.vpadding/2);
	/*.on("mouseover",function(){
		d3.select(this)
			.moveToFront()
			.transition()
			.duration(_main_transition.fast_duration)
			.ease(_main_transition.ease)
			.attr("width",_svg.width - _chart.width/2 - _svg.hpadding)
			.attr("x",_chart.width/2 + _svg.hpadding);
	})
	.on("mouseout",function(){
		d3.select(this)
			.transition()
			.duration(_main_transition.fast_duration)
			.ease(_main_transition.ease)
			.attr("width",_svg.width - _chart.width - _svg.hpadding)
			.attr("x",_chart.width + _svg.hpadding);
	})*/

	var bubble_data = d3.select(".bubble.soloed").datum(),
		cdata = jQuery.extend({}, bubble_data),
		ts_data = new Array(),
		year = check_date();

	var targetId = d3.select(".y-label").datum().TargetId,
		dividende = 1;

	if([1,2,10].indexOf(targetId) !== -1){
		dividende = 2;
	}else if(targetId === 5){
		dividende = 3;
	}else if(targetId === 6){
		dividende = 4;
	}

	var target_val = cdata.y[0]/dividende;

	for(var j=1990; j<=year; j++){
		/*if(cdata.y[j-1990] === "NA" && j>1990){
			cdata.y[j-1990] = cdata.y[j-1990-1];
		}*/
		if(cdata.y[j-1990] !== "NA"){
			ts_data.push([ j-1990, cdata.y[j-1990] ]);
		}
	}

	//window["data_anshul"] = ts_data;
	

	var reg = regression('polynomial', ts_data, 3);
	reg = reg.string.split("y = ")[1];


	var response_fo_body = response_fo.append("xhtml:body")
		.attr("class","fo-body q-and-a");

	response_fo_body.append("div")
		.attr("class","question")
		.html(question[qidx]);

	answers_row1 = response_fo_body.append("div")
		.attr("class","possible-ans-row")

		//console.log(answers[qidx])

	var ans = answers_row1.selectAll(".possible-ans")
		.data(answers[qidx]);

	ans.enter()	
		.append("div")
		.attr("class",function(d,i){
			if(answers[qidx].length > 2){
				if(answers[qidx].length === 4){
					if(i < answers[qidx].length/2){
						return "possible-ans multi-row ans-" + i;
					}else{
						return "possible-ans ans-" + i;
					}
				}else{
					if(i === answers[qidx].length-1){
						return "possible-ans multi-row last-row ans-" + i;
					}else{
						return "possible-ans multi-row ans-" + i;
					}
				}
			/*}else if(answers[qidx].length > 4 && i === answers[qidx].length-1){
				return "possible-ans multi-row last-row ans-" + i;
			/*}else if(answers[qidx].length === 4){
				if(i === 2 || i === 3){
					return "possible-ans ans-" + i;
				}*/
			}else{
				return "possible-ans ans-" + i;
			}
		})
		/*.style("border-bottom",function(d,i){
			if(answers[qidx].length > 2 && i < answers[qidx].length-1){
				return "1px solid #333"
			}else{
				return null;
			}
		})
		.style("width",function(d,i){
			if(answers[qidx].length > 2 && i === answers[qidx].length-1){
				return "calc(100% - 2px)"
			}else{
				return null;
			}
		})*/
		.html(function(d){
			return d.text;
		})
		.on("click",function(d){
			if(qidx === 0){
				var answer = estimate_soloed_countries_achievement(d.value);
				set_response_field(qidx+1,answer);
			}else if(qidx > 0 && qidx < 3){
				//console.log(reg)
				var trend_vals = get_last(reg,0,(year-1990),25),
					description = "";

				if(trend_vals[1] <= target_val){
					// MOST LIKELY
					description = "most likely";
					if(d.value === 0){
						var answer = true;
					}else{
						var answer = false;
					}
				}else if(trend_vals[1] > target_val){
					if(trend_vals[0] === -1){
						// POSSIBLY
						description = "possible";
						if(d.value === 1){
							var answer = true;
						}else{
							var answer = false;
						}
					}else if(trend_vals[0] === 0){
						// UNLIKELY
						description = "unlikely";
						if(d.value === 2){
							var answer = true;
						}else{
							var answer = false;
						}
					}else if(trend_vals[0] === 1){
						// MOST UNLIKELY
						description = "most unlikely";
						if(d.value === 3){
							var answer = true;
						}else{
							var answer = false;
						}
					}
				}
				estimate_soloed_countries_achievement_proba(answer,description,trend_vals[0],trend_vals[2],trend_vals[3],prevans,target_val)
				
				clear_and_go_next(1,bubble_data);

			}else if(qidx === 3){
				//alert("here")
				if(d3.select(".show-mean").classed("active") === true){
					var correct = estimate_soloed_regions_achievement(d.value,"mean");
				}else if(d3.select(".show-median").classed("active") === true){
					var correct = estimate_soloed_regions_achievement(d.value,"median");
				}
				clear_and_go_next(2,correct);
			}
		});


	/*answers_row1.append("div")
		.attr("class","possible-ans ans-2")
		.html("No, it has not")
		.on("click",function(){
			estimate_soloed_countries_achievement(false);
		})*/

	response_fo.transition()
		.duration(_main_transition.duration)
		.ease(_main_transition.ease)
		.attr("x",_chart.width + _svg.hpadding);

}

function clear_and_go_next(stage,data){
	var svg = d3.select("svg");

	d3.selectAll(".possible-ans").remove();
	d3.select(".question").html("")
	.append("div")
		.attr("class","force-white")
		.style("line-height",(_chart.height - 160 - _svg.vpadding*2/3) + "px")
		.style("text-align","center")
		.style("cursor","pointer")
		.html("Continue&nbsp;&nbsp;&nbsp;<i class='fa fa-arrow-circle-o-right'>")
		.on("click",function(){
			var response_fo = d3.select(".question-box");

			response_fo.transition()
				.duration(_main_transition.fast_duration)
				.ease(_main_transition.ease)
				.attr("x",_chart.width + _svg.hpadding + (_svg.width - _chart.width - _svg.hpadding));
				
			d3.select("#footer").transition()
				.duration(_main_transition.fast_duration)
				.ease(_main_transition.ease)
				.style("opacity",0);

			svg.transition()
				.duration(_main_transition.duration)
				.ease(_main_transition.ease)
				.style("opacity",0)
				.each("end",function(){
					var seriesId = d3.select(".y-label").datum().SeriesRowId;
					if(stage === 1){
						return go_to_stage2(data.region_name,data.region,seriesId);
					}else if(stage === 2){
						return go_to_stage3(data);
					}
				});
		})
}

function go_to_stage2(area,region,indicator){

	d3.select("svg").remove();

	d3.select("#footer")
		.style("opacity",null)
		.classed("hide",true);

	var container = d3.select("#question-container")
			.html("")
			.classed("hide",false);

	var question = container.append("h1")
		.attr("class","minor quesiton")
		.html("Now, is the same true for the entire <em>" + area + "</em> area?<br/>Well, that might depend on the statistic used.");


	var stat_menu = container.append("div")
		.attr("class","stat-menu-container")
	.append("div")
		.attr("class","stat-menu");

	stat_menu.append("div")
		.attr("class","show-mean")
		.html("<i class='fa fa-line-chart'></i>&nbsp;&nbsp;&nbsp;Mean")
		.on("mouseover",function(){
			var txt = "The mean is the sum of all the values divided by the number of values, <em>i.e.,</em> the sum of the values for each country at a given point in time, divided by the number of countries.";
			d3.select(".stat-description")
				.html(txt);
		})
		.on("mouseout",function(){
			d3.select(".stat-description")
				.html("");
		})
		.on("click",function(){
			d3.select("#question-container")
				.html("")
				.classed("hide",true);
			d3.select("svg").remove();

			d3.select("#footer")
				.classed("hide",false);


			//set_footer();
			$("#timeline").slider().slider('setValue',1990);
			set_svg();

			set_chart_tabs();

			var sp = d3.select(".scatterplot-tab");
			sp.select("path").classed("hide",true);
			sp.select("rect").classed("hide",true);
			sp.select("text").classed("hide",true);

			set_axes();
			set_timeline();

			set_big_feedback_icon("fa-spin fa-spinner","n");

			$.post("retrievecountries")
			.done(function(countries){

				rm_big_feedback_icon();

				set_countrymenu(countries);

				d3.select("#" + region).classed("highlight-lock",true);

				d3.selectAll(".ctr-entry:not(.entry-" + region + ")")
					.classed("hide",true);

				d3.selectAll(".entry-" + region)
					//.classed("isolated",true)
					.classed("highlight-lock",true);
					//.classed("original-isolation",true);

				d3.select(".zoom-menu")
					.classed("hide",true);

				/*d3.select(".stat-menu")
					.classed("hide",true);*/

				d3.select(".show-median")
					.classed("active",false);

				set_bubbles(553,indicator,1990,true,null,region);

			});

		});

	stat_menu.append("div")
		.attr("class","show-median")
		.html("<i class='fa fa-line-chart'></i>&nbsp;&nbsp;&nbsp;Median")
		.on("mouseover",function(){
			var txt = "The median is the value separating the higher half of the data sample from the lower half, <em>i.e.,</em> the country value which is “in the middle” of all country values.";
			d3.select(".stat-description")
				.html(txt);
		})
		.on("mouseout",function(){
			d3.select(".stat-description")
				.html("");
		})
		.on("click",function(){
			d3.select("#question-container")
				.html("")
				.classed("hide",true);
			d3.select("svg").remove();

			d3.select("#footer")
				.classed("hide",false);


			//set_footer();
			$("#timeline").slider().slider('setValue',1990);
			set_svg();

			set_chart_tabs();

			var sp = d3.select(".scatterplot-tab");
			sp.select("path").classed("hide",true);
			sp.select("rect").classed("hide",true);
			sp.select("text").classed("hide",true);

			set_axes();
			set_timeline();

			set_big_feedback_icon("fa-spin fa-spinner","n");

			$.post("retrievecountries",
				$.param({ area: region })
				)
			.done(function(countries){

				rm_big_feedback_icon();

				set_countrymenu(countries);

				d3.select("#" + region).classed("highlight-lock",true);

				d3.selectAll(".ctr-entry:not(.entry-" + region + ")")
					.classed("hide",true);

				d3.selectAll(".entry-" + region)
					//.classed("isolated",true)
					.classed("highlight-lock",true);
					//.classed("original-isolation",true);

				d3.select(".zoom-menu")
					.classed("hide",true);

				/*d3.select(".stat-menu")
					.classed("hide",true);*/

				d3.select(".show-mean")
					.classed("active",false);

				set_bubbles(553,indicator,1990,true,null,region);

			});
		});

	var stat_description = container.append("div")
		.attr("class","stat-description");
}

function go_to_stage3(prevans){
	d3.select("svg").remove();

	d3.select("#footer")
		.style("opacity",null)
		.classed("hide",true);

	d3.select("#container")
		.classed("hide",true);

	var container = d3.select("#question-container")
		.html("")
		.classed("hide",false);

	/*var question = container.append("h1")
		.attr("class","minor quesiton")
		.html(function(){
			if(prevans === true){
				return "Finally, what factors might have influenced this achievement, in order keep making the world a better place?";
			}else{
				return "Finally, it is important to identify what factors might help reach this target in the future?";
			}
		});*/


	/*return $.post("retrieveindicators")
	.done(function(series){
		series = d3.nest()
			.key(function(d){ return d.GoalName; }).sortKeys(d3.ascending)
			.key(function(d){ return d.TargetName }).sortKeys(d3.ascending)
			.entries(series);*/

		var container = d3.select("#question-container")
				.classed("hide",false);

		container.append("h1")
			.attr("class","minor quesiton")
			.html(function(){
				if(prevans === true){
					return "So, how can we, the people, continue to make the world a better place using data? Well, we can look for predictive relationships (correlations) between indicators that can inform decision-makers on possible strategies to adopt, and we can share and discuss them <em>e.g.,</em> on twitter to raise public awareness.";
				}else{
					return "So, how can we, the people, make the world a better place? Well, we can look for predictive relationships (correlations) between indicators that can inform decision-makers on possible strategies to adopt, and we can share and discuss them <em>e.g.,</em> on twitter to raise public awareness.";
				}
			});

		var stat_description = container.append("div")
			.attr("class","stat-description")
			.html("<p>In statistics, the correlation coefficient <em>r</em> measures the strength and direction of a linear relationship between two variables on a scatterplot; this value is always between +1 and –1. However, if there is not at least somewhat of a linear relationship, the correlation does not mean much. In addition, a correlation does not imply causation, meaning there may be no causal relationship between correlated variables.</p>");

			container.append("div")
			.attr("class","stat-description-p2")
			.html("<p>Interpreting the correlation coefficient r:</p><ul>"+
					"<li>Exactly <strong>–1</strong> is a perfect downhill (negative) linear relationship;</li>"+
					"<li><strong>–0.70</strong> is a strong downhill (negative) linear relationship;</li>"+
					"<li><strong>–0.50</strong> is a moderate downhill (negative) relationship;</li>"+
					"<li><strong>–0.30</strong> is a weak downhill (negative) linear relationship;</li>"+
					"<li><strong>0</strong> is no linear relationship</li>"+
					"<li><strong>+0.30</strong> is a weak uphill (positive) linear relationship;</li>"+
					"<li><strong>+0.50</strong> is a moderate uphill (positive) relationship;</li>"+
					"<li><strong>+0.70</strong> is a strong uphill (positive) linear relationship; and</li>"+
					"<li>Exactly <strong>+1</strong> is a perfect uphill (positive) linear relationship</li>"+
				"</ul>");

			var next_btn = container.append("div")
					.attr("class","session-info pull-left")
				.append("div")
					.attr("class","session-btn btn-returning-user")
					.html("Start exploring the data")
					.on("click",function(){
						d3.select("#question-container")
							.remove();

						d3.select("#footer")
							.classed("hide",false)
							.html("");


						//set_footer();
						//$("#timeline").slider().slider('setValue',1990);
						//set_svg();

						//set_chart_tabs();

						/*var sp = d3.select(".scatterplot-tab");
						sp.select("path").classed("hide",true);
						sp.select("rect").classed("hide",true);
						sp.select("text").classed("hide",true);*/

						//set_axes();
						//set_timeline();

						d3.select(".zoom-menu")
							.classed("hide",false);
						return set_visualization_environment();
					})

			

		/*var headers = container.append("div")
			.attr("class","picker headers");

		var headers_data = ["High level goals", "Targets", "Indicators for measuring achivement"];

		var header_cells = headers.selectAll(".header-cell")
			.data(headers_data)
		.enter()
			.append("div")
			.attr("class","header-cell")
			.html(function(d){ return d; });

		var fo_body = container.append("div")
			.attr("class","fo-body picker original");

		var goals = fo_body.append("div")
			.attr("class","series-list list-goals")
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

				var text = d.key.split(". ")[1];

				return "<table><tr><td><i class='fa " + icon + "'></i></td><td>" + text + "?</td><td><i class='fa fa-angle-right'></i></td></tr></table>" 
			})
			.on("mouseover",function(d,i){

				var parent = d3.select(this),
					target_data = d.values;

				d3.selectAll("li.series.goal").classed("active",false);
				parent.classed("active",true);

				rm(".list-targets");
				rm(".list-series");


				var targets = fo_body.append("div")
						.attr("class","series-list list-targets")
					.append("ul")
						.attr("class","series-list-container-l2");
				var targets_entries = targets.selectAll("li.target")
						.data(target_data);
				targets_entries.enter()
					.append("li")
					.attr("class","series target")
					.html(function(c){ 
						var text = c.key.split(": ")[1];
						return "<table><tr><td>" + text + "</td><td><i class='fa fa-angle-right'></i></td></tr></table>"; 
					})
					.on("mouseover",function(c,j){

						var parent = d3.select(this),
							indicator_data = c.values;

						d3.selectAll("li.series.target").classed("active",false);
						parent.classed("active",true);

						rm(".list-series");

						var indicators = fo_body.append("div")
								.attr("class","series-list list-series")
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
								/*container.append("i")
									.attr("class","fa fa-arrow-down");*/
								/*set_second_question(b.SeriesRowId);
							});
						
					})
					.on("click",function(){
						return d3.event.stopPropagation();
					});
			})
			.on("click",function(){
				return d3.event.stopPropagation();
			});

	});*/

}
