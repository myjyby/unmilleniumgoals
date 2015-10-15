function rm(selector){
	return d3.selectAll(selector).remove();
}

function rm_check_countrylabel(parent,conditionnode,condition){
	if(!condition){
		if(parent.select(".ctr-label-text")[0][0]){
			return rm_countrylabel(parent);
		}else{
			return null;
		}
	}else{
		if(conditionnode.classed(condition) === true){
			return null;
		}else{

			if(parent.select(".ctr-label-text")[0][0]){
				return rm_countrylabel(parent);
			}else{
				return null;
			}
		}
	}
}

function rm_force_countrylabel(parent){
	if(!parent){
		d3.selectAll(".ctr-label-text").remove();
		d3.selectAll(".ctr-label-contour").remove();
		d3.selectAll(".ctr-label-line").remove();
	}else{
		parent.select(".ctr-label-text").remove();
		parent.select(".ctr-label-contour").remove();
		parent.select(".ctr-label-line").remove();
	}
}

function rm_countrylabel(parent){
	
	var label_pos = determine_bubble_position(parent);

	var text = parent.select("text")
		.transition()
		.duration(_main_transition.fast_duration)
		.ease("elastic-in")
		.attr("x",0)
		.attr("y",0)
		.style("opacity",0)
		.each("end",function(){
			d3.select(this).remove();
		});

	var bbox = text.node().getBBox();

	var contour = parent.select("rect")
		.transition()
		.duration(_main_transition.fast_duration)
		.ease(_main_transition.ease)
		.attr("x",0)
		.attr("y",0)
		.attr("width",0)
		.attr("height",0)
		.style("opacity",0)
		.each("end",function(){
			d3.select(this).remove();
		});

	var line = parent.select("line")
		.transition()
		.duration(_main_transition.very_fast_duration)
		.ease(_main_transition.ease)
		.attr("x2",function(){
			if(label_pos[0] === "left"){
				return -parent.select(".main-bubble").attr("r");
			}else if(label_pos[0] === "right"){
				return parent.select(".main-bubble").attr("r");
			}else if(label_pos[0] === "center"){
				return 0;
			}
		})
		.attr("y2",function(){
			if(label_pos[1] === "top"){
				return -parent.select(".main-bubble").attr("r");
			}else if(label_pos[1] === "bottom"){
				return parent.select(".main-bubble").attr("r");
			}else if(label_pos[1] === "middle"){
				return 0;
			}
		})
		.each("end",function(){
			d3.select(this).remove();
		});

	/*setTimeout(function(){
		text.remove();
		contour.remove();
		line.remove();
	},_main_transition.duration)*/

}

function rm_temporalline(idx){
	if(!idx){
		return d3.selectAll(".ts").remove();
	}else{
		return d3.selectAll(".ts-" + idx).remove();
	}
}



function rm_all_bubbles(){
	return d3.selectAll(".bubble").remove();
}

function rm_big_feedback_icon(){
	return d3.select(".fo-body.feedback")
		.select(".huge")
		.transition()
		.duration(_main_transition.duration)
		.ease(_main_transition.ease)
		.style("opacity",0)
		.each("end",function(){
			d3.selectAll(".big-feedback").remove();
		});
}

function rm_force_big_feedback_icon(){
	return d3.selectAll(".fo-body.feedback").remove();
}

function rm_force_variability(){
	return d3.selectAll(".variability").remove();
}

function rm_variability_styling(){
	return d3.selectAll(".bubble").classed("err-bar",false);
}

function rm_goal_line(){
	return d3.selectAll(".target-val").remove();
}

function rm_stat_lines(){
	return d3.selectAll(".stat").remove();
}

function rm_correlation_line(){
	return d3.selectAll(".correlation").remove();
}

function rm_stat_bubbtons(){
	return d3.select(".stat-picker-menu").remove();
}