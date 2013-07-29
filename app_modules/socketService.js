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

var map = {
	campaign: require('./services/campaignService')(app),
	//Skill: require('./services/skillService')(app)
};

module.exports = function(app) {

	var insert = function(token, e, item, callback) {
		var eventData = e.split("|"),
			model = eventData[0],
			id = eventData[1],
			childModel = eventData[2];

		if (childModel === undefined) { //Root
			map[model].insert(token, item, callback);
		} else { //Sub
			map[model].insertChild(token, id, childModel, item, callback);
		}
	};

	var remove = function(token, e, callback) {
		var eventData = e.split("|"),
			model = eventData[0],
			id = eventData[1],
			childModel = eventData[2],
			childId = eventData[3];

		if (childModel === undefined) { //Root
			map[model].remove(token, id, callback);
		} else { //Sub
			map[model].removeChild(token, id, childModel, childId, callback);
		}
	};

	var update = function(token, e, newValue, callback) {
		var eventData = e.split("|"),
			model = eventData[0],
			id = eventData[1],
			property = eventData[2];

		map[model].update(token, id, property, newValue, callback);
	};

	return {
		insert: insert,
		remove: remove,
		update: update
	};
};