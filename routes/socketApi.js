module.exports = function(app) {
	var auth = app.tokenAuth,
		socketService = app.socketService;

	//Close around the req, res so that lower layers don't need them
	//Lower layers will just use the returning function
	var handlerCallback = function(req, res) {
		return function(error, eventName, result) {
			if (!error) {
				res.json(result);

				if(eventName !== null)
					app.sockets.broadcast(req.socketId, eventName, result);
			} else {
				console.log(error.message);
				res.send(error.code, error.message);
			}
		};
	};

	app.get('/api/:eventName', auth.requireToken, function (req, res) {
		var eventData = req.params.eventName;

		socketService.get(req.token, eventData, handlerCallback(req, res));
	});

	app.put('/api/:eventName', auth.requireToken, function (req, res) {
		var eventData = req.params.eventName,
			item = req.body;

		socketService.insert(req.token, eventData, item, handlerCallback(req, res));
	});

	app.delete('/api/:eventName', auth.requireToken, function (req, res) {
		var eventData = req.params.eventName;

		//For value types, the id will just be the value, but this layer isn't concerned
		socketService.remove(req.token, eventData, handlerCallback(req, res));
	});

	app.post('/api/:eventName', auth.requireToken, function (req, res) {
		var eventData = req.params.eventName,
			value = req.body;

		socketService.update(req.token, eventData, value, handlerCallback(req, res));
	});
};