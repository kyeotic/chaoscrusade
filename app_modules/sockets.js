
module.exports = function(io) {
	
	var middleware = function(req, res, next) {
		req.socketId = req.headers['x-socket-id'];
		next();
	};

	var broadcast = function(socketId, eventName, message) {
		if (!eventName || !message)
			return;
		
		//If we have no socket, broadcast to everyone
		//Because the connection came from a non-websocket source
		if (!socketId)
			io.sockets.emit(eventName, message);
		else
			io.sockets[socketId].broadcast.emit(eventName, message);
	};

	var on = io.sockets.on;

	return {
		middleware: middleware,
		broadcast: broadcast,
		on: on
	};
};
