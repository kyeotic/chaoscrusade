module.exports = function(app) {
	var auth = app.tokenAuth,
		socketHandler = app.socketHandler;

	var splitEvent = function(eventName) {
		var split = req.params.eventName.split("|");
		return { model: split[0], id: split[1], property: split[2] };
	}

	var handlerCallback = function(req, res) {
		return function(error, eventName, result) {
			if (!error) {
				res.json(result);
				app.sockets.broadcast(req.socketId, eventName, result);
			} else {
				console.log(error.message);
				res.send(error.code, error.message);
			}
		};
	};	

	app.post('/api/:eventName', auth.requireToken, function(req, res) {
		var eventData = splitEvent(req.params.eventName),
			value = req.body;

			socketHandler.update(req.token, eventData, value, handlerCallback(req, res));
	});

	app.put('/api/:eventName', auth.requireToken, function(req, res) {
		var eventData = splitEvent(req.params.eventName),
			item = req.body;

			socketHandler.insert(req.token, eventData, item, handlerCallback(req, res));
	});

	app.delete('/api/:eventName/:id', auth.requireToken, function(req, res) {
		var eventData = splitEvent(req.params.eventName),
			id = req.params.id;

			//For value types, the id will just be the value, but this layer isn't concerned
			socketHandler.remove(req.token, eventData, id, handlerCallback(req, res));
	});
};