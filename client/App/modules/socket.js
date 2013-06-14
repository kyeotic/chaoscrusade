define(['durandal/app', 'modules/dataContext', 'modules/serviceBase'], 
function(app, dataContext, serviceBase) {	
    var socket = io.connect('http://' + window.location.host);

    socket.on('connect', function () {
        serviceBase.setSocketId(socket.socket.sessionid);
    });
    
    return socket;
});