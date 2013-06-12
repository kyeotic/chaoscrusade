define(['durandal/app', 'modules/dataContext', 'modules/serviceBase'], 
function(app, dataContext, serviceBase) {	
    var socket = io.connect('http://' + window.location.host);

    socket.on('connect', function () {
        serviceBase.setSocketId(socket.socket.sessionid);
    });
    
    socket.on('campaignAdded', dataContext.raise.campaignAdded);
    socket.on('campaignAdded', function(){
        app.log('successful socket add event');
    });
    socket.on('campaignRemoved', dataContext.raise.campaignRemoved);

    return socket;
});