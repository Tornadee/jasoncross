// COPYRIGHT JASON (SEOJOON) YEON 
// 2018 ~ 2019

// Information extracted from page stored in RAM
var jc_data = [];
var ext_dat = {each_g:[]};
// this is the top bar that says "All Assignments".
// when clicked, it re-initializes Jasoncross.
$("a.filter-assignments").click(function() {
	ext_dat = {each_g:[]};
	setTimeout(function() {activate_or_popup()}, 300);
});
$(document).ready(function() {
	// Does the user agree to the terms and condistions?
	setTimeout(function() {activate_or_popup()}, 100);
	// Initial CSS styling
	var link = document.createElement("link");
	link.href = chrome.extension.getURL("page.css");
	link.type = "text/css"; link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
	$(".right-controls").remove();
});
// Teacher generosity index (TGI)
function tgi_init() {
	if ($("#tgi_text").length == 0) {
		var TGI_HTML = "<i id='tgi_text'>Teacher Generosity Index (TGI) = "+"..."+"</i>";
		$(".enrollment-title").append(" | "+TGI_HTML);
		var tea_id = $("a.class-teacher").text();
		$.ajax({
			type: 'POST', dataType: "json",
			url: "https://www.sy9000.xyz/tgi",
			data: JSON.stringify({tea_id}),
			success: function(rec_data) {
				tgi_val = String(Math.round(Number(rec_data) * 10) / 10)
				$("#tgi_text").text("Teacher Generosity Index (TGI) = "+tgi_val+"")
			},
			error: function (xhr, status, error) {
			    console.log('Jasoncross networking error: ' + error.message);
			}
		});
	}
}
function element_edit() {
	// turn off annoying hover
	$(".assignment-criteria-grade").hover(function(event) {event.preventDefault()});
	// add average display
	for (var i=0;i<$(".assignment-criteria-grade").length;i++) {
		var new_id = "newb"+i;
		var displayHTML = "<div class='newb_class' id='" + new_id + "'>...</div>";
		$(".assignment-criteria-grade").eq(i).append(displayHTML);
		// add distribution display
		var distHTML = "<div class='dist_class' id='dist"+new_id+"'></div>";
		$(".assignment-criteria-grade").eq(i).parent().append(distHTML);
	}
}
function activate_or_popup() {
	chrome.storage.sync.get(["enabled"], function(items) {
		enabled = items.enabled;
		if (enabled != "no") {
			var allowed_to_run = localStorage.getItem("allowed_yes_no");
			if (allowed_to_run == undefined) {jasoncross_popup()} else {
				var loadout = 15;
				var interval = setInterval(function() {
					if (ext_dat.each_g.length == 0) {
						loadout -= 1;
						jasoncross_activate();
						tgi_init();
						element_edit();
						if (loadout <= 0) clearInterval(interval);
					}
				},1000);
			};
		}
	});
}
function jasoncross_popup() {
	var title = "<b class='heading_class'>Jasoncross Activation</b>";
	var desc = "<br>";
	var button = "<br><hr><br><div id='allowaccess'>Confirm and Activate Jasoncross</div>";
	var popupHTML = "<div class='popup_class'>"+title+desc+button+"</div>";
	$("body").append(popupHTML);
	$("#allowaccess").click(function() {
		$(".popup_class").remove();
		localStorage.setItem("allowed_yes_no", "yes");
		location.reload();
	});
}
function encode(input) {
	return btoa(input).split('=').join("");
}
async function extract_page_data() {
	// student id = stu_id
	var stu_id = await return_my_id();
	// 						^ This is defined in identity.js
	// teacher id
	var tea_id = $("a.class-teacher").text();
	// school id
	var sch_id = window.location.href.split(".veracross.com/")[1].split("/student/classes/")[0];
		sch_id = sch_id.toUpperCase();
	// for each grade
	var each_g = [];
	for (var i=0;i<$(".assignment-criteria-grade").length;i++) {
		// task
		var task = $(".assignment-criteria-name").eq(i).parent().parent().parent().find("span.assignment-description").text();
			task = task.replace(/\s/g, "");
			task = task.split('.').join("");
			task = task.replace(/[^\w\s]/gi, '');
		// crit
		var crit = $(".assignment-criteria-name").eq(i).text();
		// grade
		var grade = Number($(".assignment-criteria-grade").eq(i).text().split("")[0]);
			if (isNaN(grade)) {grade = -1};
		// append
		each_g.push({task: encode(task),crit: encode(crit),grade: encode(grade)});
	}
	ext_dat = {stu_id: encode(stu_id),tea_id: encode(tea_id),sch_id: encode(sch_id),each_g: each_g};
	console.log(ext_dat);
	return ext_dat;
}
async function jasoncross_activate() {
	// send and pull in data
	var my_data = await extract_page_data();
	for (var i=0;i<$(".assignment-criteria-grade").length;i++) {
		var original_div = $(".assignment-criteria-grade").eq(i);
		let specific_data = {
			stu_id: my_data.stu_id,
			tea_id: my_data.tea_id,
			sch_id: my_data.sch_id,
			crit: my_data.each_g[i].crit,
			task: my_data.each_g[i].task,
			grade: my_data.each_g[i].grade
		}
		var new_id = "newb"+i;
		exchange_info(original_div, new_id, specific_data);
	}
}
// this is the main functionality of Jasoncross.
// this allows grades sharing.
function exchange_info(original_div, id, input) {
	// server connection
	$.ajax({
		type: 'POST', dataType: "json",
		url: "https://www.sy9000.xyz/insert",
		data: JSON.stringify(input),
		success: function(data) {
			var input_fixed = {
				stu_id:atob(input.stu_id),
				tea_id:atob(input.tea_id),
				sch_id:atob(input.sch_id),
				crit:atob(input.crit),
				task:atob(input.task),
				grade:atob(input.grade)
			}
			on_receive(original_div,id,input_fixed,data);
		},
		error: function (xhr, status, error) {
		    console.log('Jasoncross networking error: ' + error.message);
		}
	});
}

function on_receive(original_div,id,input,data) {
	// average box
	function add(a, b) {return a + b}
	let sum = data.reduce(add,0);
	let average = Math.round(sum / data.length * 10) / 10;
	$("#"+id).html("g̅ ≈ " + average);
	var frequency = [0,0,0,0,0,0,0,0];
	for (var i=0;i<data.length;i++) {
		gr = data[i];
		if ((gr>=0) && (gr<=8)) { // <-- Designed for MYP., not DP.
			var index = Math.round(gr) - 1;
			frequency[index] += 1;
		}
	}
	// modify css
	var myColor = "rgba(0,0,0,0)";
	if (average > input.grade) {
		myColor = "rgba(255,0,0,0.5)";
	} else if (average < input.grade) {
		myColor = "rgba(0,255,0,0.5)";
	} else if (average == input.grade) {
		myColor = "rgba(255,208,0,0.5)";
	}
	original_div.css("background-image", "linear-gradient(135deg, "+myColor+", rgba(0,0,0,0))");
	// Draws the frequency bar graph
	var most = 0;
	for (var i=0;i<frequency.length;i++) {
		if (frequency[i] > most) {
			most = frequency[i];
		}
	}
	var ratio = 20/most;
	for (var i=0;i<frequency.length;i++) {
		var percent = frequency[i] / data.length;
		var height = frequency[i] * ratio;
		var left = 18 * i + 9;
		var color = "#adadad";
		if (i == input.grade-1) {
			color = myColor;
		}
		barHTML = "<span class='bar_class' style='height:"+height+"px;left:"+left+"px;background:"+color+";border-bottom-color:"+color+"'></span>";
		$("#dist"+id).append(barHTML);
	}
	// add it to RAM so that Jasoncross can access it later.
	jc_data.push({
		crit: input.crit,
		task: input.crit,
		my_grade: input.grade,
		av_grade: average
	});
	jc_show(); // <-- page_extras.js
}
