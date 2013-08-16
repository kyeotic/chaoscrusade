module.exports = function(app) {

	var serviceBase = new require('./serviceBase')(app, 'skillAdvancements', 'skillAdvancement');

	//callback(error, eventName, result)

	var checkToken = function(token) {
		//TODO
		return true;
	};

	var get = function (token, callback) {
		serviceBase.get(callback);
	};

	var getChildren = function (token, id, childModel, callback) {
		serviceBase.getChildren(id, childModel, callback);
	};

	var insert = function(token, itemToAdd, callback) {
		serviceBase.insert(itemToAdd, callback);
	};

	var insertChild = function(token, id, childModel, childItem, callback) {
		serviceBase.insertChild(id, childModel, childItem, callback);
	};

	var remove  = function(token, id, callback) {
		serviceBase.remove(id, callback);
	};

	var removeChild = function(token, id, childModel, childId, callback) {
		serviceBase.removeChild(id, childModel, childId, callback);
	};

	var update = function(token, modelId, property, newValue, callback) {
		serviceBase.update(modelId, property, newValue, callback);
	};

	return {
		get: get,
		getChildren: getChildren,

		update: update,

		insert: insert,
		insertChild: insertChild,

		remove: remove,
		removeChild: removeChild
	};
};