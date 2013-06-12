
module.exports = function(req, res, next) {
	req.socketId = req.headers['x-socket-id'];
	next();
};