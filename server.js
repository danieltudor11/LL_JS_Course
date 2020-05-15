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

function askingWeather(msg) {
	return msg.match(/weather/i)
}

function askingTemp(msg) {
	return msg.match(/temperature/i)
}

function getWeather(callback) {
	var request = require('request');
	request.get("https://www.metaweather.com/api/location/4118/",
		function (error, response) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(response.body);
				callback(data.consolidated_weather[0].weather_state_name);
			}
		})
}
function getTemp(callback) {
	var request = require('request');
	request.get("https://www.metaweather.com/api/location/4118/",
		function (error, response) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(response.body);
				callback(data.consolidated_weather[0].the_temp);
			}
		})
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
			io.emit('message', "ChatBot: " + new Date().toLocaleTimeString());
		}
		else if (askingWeather(msg)){
			console.log('User asked for weather');
			io.emit('message', msg);
			getWeather(function(weather) {
				io.emit('message', "ChatBot: " + weather);
			})
		}
		else if (askingTemp(msg)){
			console.log('User asked for temperature');
			io.emit('message', msg);
			var degree = "°";
			getTemp(function(temp) {
				io.emit('message', "ChatBot: " + temp + degree + "C");
			})
		}
		else {
			console.log('User asked another question');
			io.emit('message', msg);
			io.emit('message', "ChatBot: sorry, but I don't know how to answer that");
		}
	});
});

server.listen(8080, function() {
	console.log('Chat server running');
});