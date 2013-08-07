module.exports = function(app, setName, itemName) {
	var seperator = '|',
		db = app.db,
		collection = db[setName];

	return {
		get: function(callback) {
			collection.find().exec(function(error, docs){
				callback(error, null, docs);
	        });
		},
		getChildren: function(id, childModel, callback) {
			collection.findById(id).populate(childModel).exec(function(error, doc) {
				callback(error, null, doc[childModel]);
			});
		},
		insert: function(itemToAdd, callback) {
			collection.create(itemToAdd, function(error, doc) {
		        if (!error) {
		        	callback(null, [setName, 'added'].join(seperator), doc);
		        } else {
		        	callback(new app.errors.ServerError('Unable to add '+itemName+'.'));
		        }
		    });
		},
		insertChild: function(id, childModel, childItem, callback) {
			var childCollection = db[childModel],
				childId = childItem.id;

			var addToParent = function(childDoc) {
				collection.findById(id, function(error, doc) {
					if (!error) {
						doc[childModel].push(childId);
						
						doc.save(function(error) {
							if (!error)
								callback(null, [setName, id, childModel, 'added'].join(seperator), childDoc);
							else
								callback(new app.errors.ServerError('Unable to update '+itemName+'.'));
						});

					} else {
						callback(new app.errors.ServerError('Unable to load '+itemName+'.'));
					}
				});
			}

			//We need to create the child first if it doesn't exist
			childCollection.findById(childItem.id, function(error, childCheck) {
				if (!error)
					addToParent(childCheck);
				else {
					childCollection.create(childItem, function(error, childDoc) {
				        if (error) {
				        	callback(new app.errors.ServerError('Unable to add '+itemName+'.'));				        	
				        } else {
				        	childId = childDoc.id;
				        	addToParent(childDoc);
				        }
				    });
				}
			});			
		},
		remove: function(id, callback) {
			collection.remove({ _id: id}, function(error) {
	            if (!error) {
	            	callback(null, [setName, 'removed'].join(seperator), id);
	            }
	            else {
	            	callback(new app.errors.ServerError('Unable to delete '+itemName+'.'));
	            }
	        });
		},
		removeChild: function(id, childModel, childId, callback) {
			collection.findById(id, function(error, doc) {

				if (error) {
					callback(new app.errors.ServerError('Unable to remove '+ childModel +' from '+itemName+'.'));

				} else {
					var removeChildFromParent = function() {

						doc[childModel].remove(childId);

						doc.save(function(error) {
							if (!error)
								callback(null, [setName, id, childModel, 'removed'].join(seperator), childId);
							else
								callback(new app.errors.ServerError('Unable to update '+itemName+'.'));
						});	
					};

					//If we need to cascade the child delete, the child has to go first

					if (!doc.checkChildRemoveCascade(childModel)) {
						db[childModel].remove( { _id: childId}, function(error) {
							if (error)
								callback(new app.errors.ServerError('Unable to remove '+ childModel +' from '+itemName+'.'));
							else
								removeChildFromParent();
						})
					} else {
						removeChildFromParent();
					}
				}
			});
		},
		update: function(modelId, property, newValue, callback) {
			collection.findById(modelId, function(error, doc) {
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
		}
	}
};