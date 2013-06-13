
module.exports = function(io) {
	
	var middleware = function(req, res, next) {
		req.socketId = req.headers['x-socket-id'];
		next();
	};

	var broadcast = function(socketId, eventName, message) {
		if (!socketId || !eventName || !message)
			return;
		io.sockets[socketId].broadcast.emit(eventName, message);
	};

	var on = io.sockets.on;

	return {
		middleware: middleware,
		broadcast: broadcast,
		on: on
	};
};
