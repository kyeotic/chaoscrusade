/*
			| Root Collection	| Sub Collection							|
	------------------------------------------------------------------------
	Add		| Model				| ParentModel-ParentId-ChildModel			|
	------------------------------------------------------------------------
	Remove	| Model-Id			| ParentModel-ParentId-ChildModel-ChildId	|							|
	------------------------------------------------------------------------
	Change	| Model-Id-Property	| ChildModel-ChildId-ChildProperty			|
	------------------------------------------------------------------------
*/

module.exports = function(app) {

	var map = {
		Campaign: require('./services/campaignService')(app),
		//Skill: require('./services/skillService')(app)
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