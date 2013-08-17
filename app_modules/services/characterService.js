module.exports = function(app) {

	var skills = new require('./serviceBase')(app, 'skillAdvancements', 'skillAdvancement'),
		stats = new require('./serviceBase')(app, 'statsAdvancements', 'statAdvancement'),
		characters = new require('./serviceBase')(app, 'characters', 'character');

	//callback(error, eventName, result)

	var checkToken = function(token, characterId) {
		//TODO
		return true;
	};

	var Service = function(base) {
		this.get = function (token, callback) {
			base.get(callback);
		};

		this.getChildren = function (token, id, childModel, callback) {
			base.getChildren(id, childModel, callback);
		};

		this.insert = function(token, itemToAdd, callback) {
			base.insert(itemToAdd, callback);
		};

		this.insertChild = function(token, id, childModel, childItem, callback) {
			base.insertChild(id, childModel, childItem, callback);
		};

		this.remove  = function(token, id, callback) {
			base.remove(id, callback);
		};

		this.removeChild = function(token, id, childModel, childId, callback) {
			base.removeChild(id, childModel, childId, callback);
		};

		this.update = function(token, modelId, property, newValue, callback) {
			base.update(modelId, property, newValue, callback);
		};
	};

	return {
		characters: new Service(characters),
		skillAdvancements: new Service(skills),
		skillAdvancements: new Service(stats)
	};
};