modules.exports = function(app) {
	var Campaigns = app.db.Campaigns;

	//callback(error, eventName, result)

	var checkToken = function(token) {
		//TODO
	};

	var update = function(token, modelId, property, newValue, callback) {
		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to update campaign, invalid token.");

		Campaigns.findById(modelId, function(error, campaign) {
			if (!error) {
				campaign[property] = newValue;
				
				campaign.save(function(error) {
					if (!error)
						callback(null, 'Campaign|' + modelId + '|changed', newValue);
					else
						callback(new app.errors.ServerError('Unable to update campiagn.'));
				});

			} else {
				callback(new app.errors.ServerError('Unable to load campiagn.'));
			}
		});
	};

	/*
		modelId is not used by the insert and remove
		the property 
	*/
	var insert = function(token, modelId, property, item, callback) {
		//TODO if modelId ahd property are present, we are inserting a child

		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to add campaign, invalid token.");

		Campaigns.create(item, function(error, campaign) {
            if (!error) {
            	callback(null, "Campaign|added", campaign);
            } else {
            	callback(new app.errors.ServerError("Unable to add campaign.");
            }
        });

	};

	var remove  = function(token, modelId, property, id, callback) {
		//TODO if modelId ahd property are present, we are deleting a child

		if (!checkToken(token))
			callback(new app.errors.SecurityError("Unable to delete campaign, invalid token.");

		Campaigns.remove({ _id: id}, function(error) {
            if (!error) {
            	callback(null, "Campaign|removed", id);
            }
            else {
            	callback(new app.errors.ServerError("Unable to delete campaign.");
            }
        });
	};

	return {
		update: update,
		insert: insert,
		remove: remove
	};
};