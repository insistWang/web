var ws = require("nodejs-websocket")
var port = 3000;
var clientCount = 0;

var server = ws.createServer(function (conn){
	console.log("new connection")

	clientCount++
	conn.nickname = "user"+clientCount;
	var mes = {}
	mes.type = "enter"
	mes.data = conn.nickname+" come in"

	broadcast(JSON.stringify(mes));

	mes.type = "roomMessage"
	mes.data = clientCount

	broadcast(JSON.stringify(mes));


	conn.on("text",function(str){
		console.log("received"+str)
		var mes = {}
		mes.type = "message"
		mes.data = conn.nickname+" say:"+str
		broadcast(JSON.stringify(mes))
	})
	conn.on("close",function(code,reason){
		console.log("close");
		var mes = {}
		mes.type = "leave"
		mes.data = conn.nickname+" leave"
		broadcast(JSON.stringify(mes))
	})
	conn.on("error",function(error){
		console.log("error:"+error);
	})

}).listen(port);
console.log("websocket is startting at port:" + port);

function broadcast(str){
	server.connections.forEach(function(connection){
		connection.sendText(str);
	})
}