define(['durandal/app', 'durandal/events'], 
function(app, events) {
	app.socket = io.connect('http://' + window.location.host);

    app.socket.on('test', function(data) {
        app.log("Socket send", data, app.socket);
    });  

    return {

    };
});