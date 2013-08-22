define(['durandal/app', 'services/http'], 
function(app, http) {	
    var socket = io.connect('http://' + window.location.hostname + ':' + window.appHostPort);
    //var socket = io.connect('http://' + window.location.host);
    socket.on('connect', function () {
        http.setSocketId(socket.socket.sessionid);
    });
    
    return socket;
});