define(['durandal/app', 'durandal/events'], 
function(app, Events) {
	

    app.socket.on('test', function(data) {
        app.log("Socket send", data, app.socket);
    });  

    var socketEvents = new Events();

    var Socket = function(host, namespace) {
    	var self = this;
    	namespace = namespace || '';

    	var socket = io.connect('http://' + window.location.host + '/' + namespace);

    	
    };

    return Socket;
});