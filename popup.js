var enabled = "";
//var confirmed = "";
$( document ).ready(function() {
	// confirmation
	/*
	chrome.storage.sync.get(["confirmed"], function(items) {
		confirmed = items.confirmed;
		if (confirmed != "yes") window.location = "confirm.html";
	});*/
	// enabled
	chrome.storage.sync.get(["enabled"], function(items) {
		enabled = items.enabled;
		if (enabled == "yes") {
			$("#enabled").css("backgroundColor","rgba(0,255,0,0.5)");
			$("#enabled").text("Enabled");
		} else if (enabled == "no") {
			$("#enabled").css("backgroundColor","rgba(255,0,0,0.5)");
			$("#enabled").text("Disabled");
		} else {
			enabled = "yes";
			chrome.storage.sync.set({ "enabled": "yes" }, function() {
				$("#enabled").animate({
					backgroundColor: "rgba(0,255,0,0.5)"
				},200);
			});
		}
	});
});

$("#enabled").click(function() {
	if (enabled == "yes") {
		enabled = "no";
		chrome.storage.sync.set({ "enabled": "no" }, function(){
			$("#enabled").animate({
				backgroundColor: "rgba(255,0,0,0.5)"
			},200);
			$("#enabled").text("Disabled");
		});
	} else if (enabled == "no") {
		enabled = "yes";
		chrome.storage.sync.set({ "enabled": "yes" }, function(){
			$("#enabled").animate({
				backgroundColor: "rgba(0,255,0,0.5)"
			},200);
			$("#enabled").text("Enabled");
		});
	}
});
