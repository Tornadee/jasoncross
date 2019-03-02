// COPYRIGHT JASON (SEOJOON) YEON 
// 2018 ~ 2019

// this is an additional feature. (Not main feature)
// It shows a graph.
var showing = false;
function jc_show() {
	if (!showing) {showing=true;
		$("a.filter-updates").css("visibility", "visible");
		$("a.filter-updates").text("Jasoncross Analysis");
		$("a.filter-updates").click(function() {
			var my_ABCD = [0,0,0,0];
			var av_ABCD = [0,0,0,0];
			var count_ABCD = [0,0,0,0];
			for (var i=0;i<jc_data.length;i++) {
				var first_letter = jc_data[i].crit.split("")[0];
				jc_data[i].crit_letter = first_letter;
				var letters = ["A","B","C","D"];
				var letter_index = letters.indexOf(first_letter);
				if (letter_index >= 0) {
					my_ABCD[letter_index] += Number(jc_data[i].my_grade);
					av_ABCD[letter_index] += Number(jc_data[i].av_grade);
					count_ABCD[letter_index] += 1;
				}
			}
			for (var i=0;i<my_ABCD.length;i++) {
				my_ABCD[i] = Math.round(my_ABCD[i]/count_ABCD[i]*10)/10;
				av_ABCD[i] = Math.round(av_ABCD[i]/count_ABCD[i]*10)/10;
				if (!(my_ABCD[i] >= 0)) {
					my_ABCD[i] = "";
				}
				if (!(av_ABCD[i] >= 0)) {
					av_ABCD[i] = "";
				}
			}
			// make HTMl elements
			var print = "";
			print += "<div class='padding_analysis'>";
			print += "<h1 class='jc_title'>Average comparison</h1><p>Note: Strands not considered.</p>";
			print += "<center><table class='ABCD_table'><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>";
			print += "<tr><th>My grade</th><th>"+my_ABCD[0]+"</th><th>"+my_ABCD[1]+"</th><th>"+my_ABCD[2]+"</th><th>"+my_ABCD[3]+"</th></tr>";
			print += "<tr><th>Average</th><th>"+av_ABCD[0]+"</th><th>"+av_ABCD[1]+"</th><th>"+av_ABCD[2]+"</th><th>"+av_ABCD[3]+"</th></tr>";
			print += "</table></center><br>";
			print += "<canvas id='myCanvas'></canvas>";
			print += "</div>";
			$(".assignment-list").html(print);
			// CANVAS
			var c = document.getElementById("myCanvas");
			c.width = 300;
			c.height = 300;
			var ctx = c.getContext("2d");
			var ext_scale = 105/8;
			// their
			ctx.strokeStyle = "a5a5a5";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(150, -1 * av_ABCD[0]*ext_scale + 150);//A
			ctx.lineTo(150 + av_ABCD[1]*ext_scale, 150);//B
			ctx.lineTo(150, av_ABCD[2]*ext_scale + 150);//C
			ctx.lineTo(150 - av_ABCD[3]*ext_scale, 150);//D
			ctx.lineTo(150, -1 * av_ABCD[0]*ext_scale + 150);//A
			ctx.stroke();
			// my
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(150, -1 * my_ABCD[0]*ext_scale + 150-2);//A
			ctx.lineTo(150+2 + my_ABCD[1]*ext_scale, 150);//B
			ctx.lineTo(150, my_ABCD[2]*ext_scale + 150+2);//C
			ctx.lineTo(150-2 - my_ABCD[3]*ext_scale, 150);//D
			ctx.lineTo(150, -1 * my_ABCD[0]*ext_scale + 150-2);//A
			ctx.stroke();
		});
	}
}
