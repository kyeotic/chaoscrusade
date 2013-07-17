modules.exports = function(app) {
	var Campaigns = app.db.Campaigns;

	//callback(error, eventName, result)

	var update = function(token, modelId, property, newValue, callback) {

	};

	/*
		modelId is not used by the insert and remove
		the property 
	*/
	var insert = function(token, modelId, property, item, callback) {
		//TODO: check token


	};

	var remove  = function(token, modelId, property, id, callback) {

	};

	return {
		update: update,
		insert: insert,
		remove: remove
	};
};