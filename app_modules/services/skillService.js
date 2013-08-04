module.exports = function(app) {

	var Collection = app.db.Skills,
		setName = 'skills',
		itemName = 'skill',
		j = '|';

	//callback(error, eventName, result)

	var checkToken = function(token) {
		//TODO
		return true;
	};

	var get = function (token, callback) {
		Collection.find().exec(function(error, docs){
			callback(error, null, docs);
        });
	};

	var getChildren = function (token, id, childModel, callback) {
		Collection.find().populate(childModel).exec(function(error, doc) {
			callback(error, null, doc[childModel]);
		});
	};

	var insert = function(token, itemToAdd, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError('Unable to add '+itemName+', invalid token.'));

		Collection.create(itemToAdd, function(error, doc) {
            if (!error) {
            	callback(null, [setName, 'added'].join(j), doc);
            } else {
            	callback(new app.errors.ServerError('Unable to add '+itemName+'.'));
            }
        });
	};

	var insertChild = function(token, id, childModel, childId, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError('Unable to add '+itemName+', invalid token.'));

		Collection.findById(id, function(error, doc) {
			if (!error) {
				doc[childModel].push(childId);
				
				doc.save(function(error) {
					if (!error)
						callback(null, [setName, id, childModel, 'added'].join(j), childId);
					else
						callback(new app.errors.ServerError('Unable to update '+itemName+'.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load '+itemName+'.'));
			}
		});
	};

	var remove  = function(token, id, callback) {
		//TODO if modelId ahd property are present, we are deleting a child

		if (!checkToken(token))
			callback(new app.errors.SecurityError('Unable to delete '+itemName+', invalid token.'));

		Collection.remove({ _id: id}, function(error) {
            if (!error) {
            	callback(null, [setName, 'removed'].join(j), id);
            }
            else {
            	callback(new app.errors.ServerError('Unable to delete '+itemName+'.'));
            }
        });
	};

	var removeChild = function(token, id, childModel, childId, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError('Unable to delete '+itemName+', invalid token.'));


		Collection.findById(id, function(error, doc) {
			if (!error) {
				doc[childModel].remove(childId);
				
				doc.save(function(error) {
					if (!error)
						callback(null, [setName, id, childModel, 'removed'].join(j), childId);
					else
						callback(new app.errors.ServerError('Unable to update '+itemName+'.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load '+itemName+'.'));
			}
		});
	};


	var update = function(token, modelId, property, newValue, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError('Unable to update campaign, invalid token.'));

		Collection.findById(modelId, function(error, doc) {
			if (!error) {
				doc[property] = newValue;
				
				doc.save(function(error) {
					if (!error)
						callback(null, [setName, modelId, 'changed'], newValue);
					else
						callback(new app.errors.ServerError('Unable to update '+itemName+'.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load '+itemName+'.'));
			}
		});
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