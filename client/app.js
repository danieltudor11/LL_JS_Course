var socket = io();

$('form').on('submit',function () {
	var text = $('#message').val();
	var who = $('#initials').val();

	socket.emit('message', who + ": " + text);
	$('#message').val('');

	return false;
});

socket.on('message', function(msg) {
	$('<li>').text(msg).appendTo('#history');
});