module.exports = function(app) {

	var map = {
		Campaign: require('./services/campaignService')(app)
	};

	return {
		update: function(token, e, newValue, callback) {
			map[e.model].update(token, e.id, e.property, newValue, callback);
		},
		insert: function(token, e, item, callback) {
			map[e.model].insert(token, e.id, e.property, item, callback);
		},
		remove: function(token, e, id, callback) {
			map[e.modele].remove(token, e.id, e.property, id, callback);
		}
	}
};