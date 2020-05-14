var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);


function isQuestion(msg) {
	return msg.match(/\?$/)
}

function askingTime(msg) {
	return msg.match(/time/i)
}


io.on('connection', function(socket) {
	socket.on('message', function (msg) {
		if (!isQuestion(msg)) {
			console.log('Received Message: ', msg);
			io.emit('message', msg);
		}
		else if (askingTime(msg)){
			console.log('User asked for time');
			io.emit('message', msg);
			io.emit('message', new Date().toLocaleTimeString());
		}
		else {
			console.log('User asked another question');
		}
	});
});

server.listen(8080, function() {
	console.log('Chat server running');
});