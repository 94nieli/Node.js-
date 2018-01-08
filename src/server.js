var http = require("http")
var url = require("url")

function start(route,handle) {
	function OnRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response, request)
		// var postData = "";
		// request.setEncoding("utf8");
		// request.addListener("data", function (postDataChunk) {
		// 	postData += postDataChunk;
		// 	console.log("received Post data chunk  " +
		// 		postDataChunk + '.')
		// })

		// request.addListener("end", function() {
		// 	route(handle, pathname, response, postData)
		// })
	}
	http.createServer(OnRequest).listen(8888);
	console.log("Server has started.")
}

exports.start = start;