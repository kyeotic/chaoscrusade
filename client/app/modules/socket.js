define(['durandal/app', 'modules/serviceBase'], 
function(app, serviceBase) {	
    var socket = io.connect('http://' + window.location.hostname + ':' + window.appHostPort);
    //var socket = io.connect('http://' + window.location.host);
    socket.on('connect', function () {
        serviceBase.setSocketId(socket.socket.sessionid);
    });
    
    return socket;
});