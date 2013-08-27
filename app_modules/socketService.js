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

	var characterService = require('./services/characterService')(app);

	var map = {
		campaigns: require('./services/campaignService')(app),
		characters: characterService.characters,
		skills: require('./services/skillService')(app),
		skillAdvancements: characterService.skillAdvancements,
		statAdvancements: characterService.statAdvancements
	};

	var unwrapDoc = function(doc) {
		return doc.__data__ ? doc.__data__ : doc;
	}

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
			map[model].insert(token, unwrapDoc(item), callback);
		} else { //Sub
			map[model].insertChild(token, id, childModel, unwrapDoc(item), callback);
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

		map[model].update(token, id, property, unwrapDoc(newValue), callback);
	};

	return {
		get: get,
		insert: insert,
		remove: remove,
		update: update
	};
};