function change_link() {
	var myID = $(".notifications-link").attr("href");
	myID = myID.split("nist/student/student/")[1].split("/classes")[0];
	var link = "https://portals-embed.veracross.com/nist/parent/planner?p=" + myID + "&school_year=2018";
	let len5 = $(".assignments-link").length;
	for (var i=0;i<len5;i++) {
		child = $(".assignments-link").eq(i);
		curr_link = child.attr("href");
		classId = curr_link.split("/classes/")[1].split("/assignments")[0];
		new_link = "https://portals-embed.veracross.com/nist/student/classes/" + classId
		child.attr("href", new_link);
	}
	let len6 = $(".notifications-link").length;
	for (var i=0;i<len6;i++) {
		child = $(".notifications-link").eq(i);
		curr_link = child.attr("href");
		classId = curr_link.split("/classes/")[1].split("/assignments")[0];
		new_link = "https://portals-embed.veracross.com/nist/student/classes/" + classId;
		child.attr("href", new_link);
	}
}

$(document).ready(function() {
	setTimeout(function() {
		change_link();
	}, 1000);
});
