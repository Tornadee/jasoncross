// COPYRIGHT JASON (SEOJOON) YEON 
// 2018 ~ 2019

// generate unique ID for database entry
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
// save it to chrome storage
async function return_my_id() {
	chrome.storage.sync.get(["uniqid"], function(items) {
		var uniqid = items.uniqid;
		if (typeof uniqid == 'undefined') {
			// make a new ID and save it
			// probably first time user.
			uniqid = makeid();
			chrome.storage.sync.set({ "uniqid": uniqid }, function(){});
		}
		return uniqid;
	});
}
// what is my ID?
// this is for database entry.
// don't identify using student name.
// names must be kept secret.
//var my_id = return_my_id().then(function() {
	////setTimeout(function() {
	//console.log("Jasoncross ID:");
	//console.log(my_id);
	////}, 100);
//});
