/*
			| Root Collection	| Sub Collection							|
	------------------------------------------------------------------------
	Get		| Model				| ParentModel-ParentId-ChildModel			|
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
		campaigns: require('./services/campaignService')(app),
		characters: require('./services/characterService')(app),
		skills: require('./services/skillService')(app),
		skillAdvancements: require('./services/skillAdvancementsService')(app)
	};

	var get = function(token, e, callback) {
		var eventData = e.split("|"),
			model = eventData[0],
			id = eventData[1],
			childModel = eventData[2];

		if (childModel === undefined) { //Root
			map[model].get(token, callback);
		} else { //Sub
			map[model].getChildren(token, id, childModel, callback);
		}
	};

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

		if (newValue.__data__)
			newValue = newValue.__data__;

		map[model].update(token, id, property, newValue, callback);
	};

	return {
		get: get,
		insert: insert,
		remove: remove,
		update: update
	};
};