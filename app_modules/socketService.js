module.exports = function(app) {

	var map = {
		Campaign: require('./services/campaignService')(app)
	};

	return {
		update: function(token, modelType, modelId, property, newValue, callback) {
			map[modelType].update(token, modelId, property, newValue, callback);
		},
		insert: function(token, modelType, modelId, property, item, callback) {
			map[modelType].insert(token, modelId, property, item, callback);
		},
		remove: function(token, modelType, modelId, property, id, callback) {
			map[modelType].remove(token, modelId, property, id, callback);
		}
	}
};