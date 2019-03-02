$("#confirm").click(function() {
	// confirmation
	chrome.storage.sync.set({ "confirmed": "yes" }, function(){
		window.location = "popup.html";
	});
});