module.exports = function(app) {
	var Campaigns = app.db.Campaigns;

	//callback(error, eventName, result)

	var checkToken = function(token) {
		//TODO
		return true;
	};

	var get = function (token, callback) {
		Campaigns.find().exec(function(error, campaigns){
			callback(error, null, campaigns);
        });
	};

	var getChildren = function (token, id, childModel, callback) {
		
	};

	var insert = function(token, item, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to add campaign, invalid token."));

		Campaigns.create(item, function(error, campaign) {
            if (!error) {
            	callback(null, "campaign|added", campaign);
            } else {
            	callback(new app.errors.ServerError("Unable to add campaign."));
            }
        });
	};

	var insertChild = function(token, id, childModel, childId, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to add campaign, invalid token."));

		Campaigns.findById(id, function(error, campaign) {
			if (!error) {
				campaign[childModel].push(childId);
				
				campaign.save(function(error) {
					if (!error)
						callback(null, 'campaign|' + id + '|' + childModel + '|added', childId);
					else
						callback(new app.errors.ServerError('Unable to update campiagn.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load campiagn.'));
			}
		});
	};

	var remove  = function(token, id, callback) {
		//TODO if modelId ahd property are present, we are deleting a child

		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to delete campaign, invalid token."));

		Campaigns.remove({ _id: id}, function(error) {
            if (!error) {
            	callback(null, "campaign|removed", id);
            }
            else {
            	callback(new app.errors.ServerError("Unable to delete campaign."));
            }
        });
	};

	var removeChild = function(token, id, childModel, childId, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to delete campaign, invalid token."));


		Campaigns.findById(id, function(error, campaign) {
			if (!error) {
				campaign[childModel].remove(childId);
				
				campaign.save(function(error) {
					if (!error)
						callback(null, 'campaign|' + id + '|' + childModel + '|removed', childId);
					else
						callback(new app.errors.ServerError('Unable to update campiagn.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load campiagn.'));
			}
		});
	};


	var update = function(token, modelId, property, newValue, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to update campaign, invalid token."));

		Campaigns.findById(modelId, function(error, campaign) {
			if (!error) {
				campaign[property] = newValue;
				
				campaign.save(function(error) {
					if (!error)
						callback(null, 'campaign|' + modelId + '|changed', newValue);
					else
						callback(new app.errors.ServerError('Unable to update campiagn.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load campiagn.'));
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