
module.exports = function(io) {
	
	this.middleware = function(req, res, next) {
		req.socketId = req.headers['x-socket-id'];
		next();
	};

	this.broadcast = function(socketId, eventName, message) {
		if (!socketId || !eventName || !message)
			return;
		io.sockets[socketId].broadcast.emit(eventName, message);
	};

	this.on = io.sockets.on;
};
