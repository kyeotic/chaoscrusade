module.exports = function(app) {
	var auth = app.tokenAuth,
		socketHandler = app.socketHandler;

	var splitEvent = function(eventName) {
		var split = req.params.eventName.split("|");
		return { modelType: split[0], modelId: split[1], property: split[2] };
	}

	var handlerCallback = function(error, eventName, result) {
		if (!error) {
			res.json(result);
			app.sockets.broadcast(req.socketId, eventName, result);
		} else {
			console.log(error);
			res.send(500, error);
		}
	};

	app.post('/api/:eventName', auth.requireToken, function(req, res) {
		var s = splitEvent(req.params.eventName),
			value = req.body;

			socketHandler.update(req.token, s.modelType, s.modelId, s.property, value, handlerCallback);
	});

	app.put('/api/:eventName', auth.requireToken, function(req, res) {
		var s = splitEvent(req.params.eventName),
			item = req.body;

			socketHandler.insert(req.token, s.modelType, s.modelId, s.property, item, handlerCallback);
	});

	app.delete('/api/:eventName/:id', auth.requireToken, function(req, res) {
		var s = splitEvent(req.params.eventName),
			id = req.params.id;

			//For value types, the id will just be the value, but this layer isn't concerned
			socketHandler.remove(req.token, s.modelType, s.modelId, s.property, id, handlerCallback);
	});
};