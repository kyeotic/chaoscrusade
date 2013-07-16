module.exports = function(app) {
	var auth = app.tokenAuth,
		socketHandler = app.socketHandler;

	app.post('/socketApi/:eventName', auth.requireToken, function(req, res) {
		var eventSplit = req.params.eventName.split("|"),
			modelType = eventSplit[0],
			modelId = eventSplit[1],
			property = eventSplit[2],
			value = req.body;

			socketHandler.update(req.token, modelType, modelId, property, value);
	});

	app.put('/socketApi/:eventName', auth.requireToken, function(req, res) {
		var eventSplit = req.params.eventName.split("|"),
			modelType = eventSplit[0],
			modelId = eventSplit[1],
			property = eventSplit[2],
			item = req.body;

			socketHandler.insert(req.token, modelType, modelId, property, item);
	});

	app.delete('/socketApi/:eventName/:id', auth.requireToken, function(req, res) {
		var eventSplit = req.params.eventName.split("|"),
			modelType = eventSplit[0],
			modelId = eventSplit[1],
			property = eventSplit[2],
			id = req.params.id;

			//For value types, the id will just be the value, but this layer isn't concerned
			socketHandler.remove(req.token, modelType, modelId, property, id);
	});
};