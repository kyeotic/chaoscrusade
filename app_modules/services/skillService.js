module.exports = function(app) {

	var serviceBase = new require('./serviceBase')(app, 'skills', 'skill');

	//callback(error, eventName, result)

	var checkToken = function(token) {
		//TODO
		return true;
	};
	return {
		get: function (token, callback) {
			serviceBase.get(callback);
		},
		getChildren: function (token, id, childModel, callback) {
			serviceBase.getChildren(id, childModel, callback);
		},
		update: function(token, modelId, property, newValue, callback) {
			serviceBase.update(modelId, property, newValue, callback);
		},
		insert: function(token, itemToAdd, callback) {
			serviceBase.insert(itemToAdd, callback);
		},
		insertChild: function(token, id, childModel, childItem, callback) {
			serviceBase.insertChild(id, childModel, childItem, callback);
		},
		remove: function(token, id, callback) {
			serviceBase.remove(id, callback);
		},
		removeChild: function(token, id, childModel, childId, callback) {
			serviceBase.removeChild(id, childModel, childId, callback);
		}
	};
};