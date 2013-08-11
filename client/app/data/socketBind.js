define(['durandal/app', 'knockout', 'modules/socket', 'services/socketService'], 
function(app, ko, socket, socketService) {

	//Generate a standard name for the socket event by comibing the parameters
	//Filter the empty ones here, since callers may not be Sub models
	var getEventName = function() {
		//Get all non-empty arguments
		var args = Array.prototype.slice.call(arguments).exclude(function(i) {
			return i === undefined || i === null || i === '';
		});
  		return args.join('|');
	};

	//Root sets do not pass a parentSetName or parentId
	//The event name will just filter them out
	var socketSet = function(setName, Constructor, parentSetName, parentId) {
		var set = ko.observableArray(),
			socketUpdating = false;

		if (parentId !== undefined && !ko.isObservable(parentId))
			throw new Error("Child Observable Sets must have observable parentId");

		var setupSetSockets = function() {
			
			var eventName = getEventName(parentSetName, ko.unwrap(parentId), setName);
			app.log("Registering SocketSet", eventName);

			//Publish to service
			set.subscribeArrayChanged(
				//Added
				function(newElement) {
					if (socketUpdating) {
						return;
					}
					socketService.put(eventName, newElement).then(function(response) {
						newElement.id(response.id);
					}).fail(function(error) {
						socketUpdating = true;
						set.remove(newElement);
						socketUpdating = false;
						app.log('Error', error);
						app.showMessage('There was an error adding a ' + setName.singularize() + '. Please record the error and refresh the page.', 'Error');
					});
				},
				//Removed
				function(oldElement) {
					if (socketUpdating) {
						return;
					}
					socketService.remove(eventName, ko.unwrap(oldElement.id))
						.fail(function(error) {
							socketUpdating = true;
							set.push(oldElement);
							socketUpdating = false;
							app.log('Error', error);
							app.showMessage('There was an error removing a ' + setName.singularize() + '. Please record the error and refresh the page.', 'Error');
						});
				}
			);

			//Subscribe to socket
			var add = socket.on(eventName + "|added", function(newElement) {
				socketUpdating = true;
				set.push(new Constructor(newElement));
				socketUpdating = false;
			});

			var remove = socket.on(eventName + '|removed', function(oldElement) {
				var item = set().find(function(i) {
					return ko.unwrap(i.id) == oldElement;
				});

				socketUpdating = true;
				set.remove(item);
				socketUpdating = false;
			});			

			//Load data into set without tell the socketService that WE added it
			set.loadSet = function() {
				return socketService.get(eventName)
					.then(function(response) {
						socketUpdating = true;
						set.map(response, Constructor);
						socketUpdating = false;	
						return set;
					});
			};

			set.unloadSet = function() {
				socketUpdating = true;
				set.removeAll();
				socketUpdating = false;
			};

			set.unsocket = function() {
				add.destroy();
				remove.destory();
			};
		};

		//The ParentID doesn't exist yet, but it will be set by the first save 
		//Which should be occuring as a result of this creation, or soonafter
		//We will subscribe to the ParentID, and register the rest of the set when it arrives
		if (parentId !== undefined && (ko.unwrap(parentId) === '' || ko.unwrap(parentId) === 0)) {
			var sub;
			sub = parentId.subscribe(function(newValue) {
				if (newValue === 0 || newValue === '')
					return; //We need a real value
				setupSetSockets();
				sub.dispose();
			});

			//Make empty functions for the socket
			self.loadSet = function() {};
			self.unloadSet = function() {};
			self.unsocket = function() {};
		} else { //Otherwise setup now
			setupSetSockets();
		}

		return set;
	};

	var socketModel = function(model, modelName, map) {
		if (map.id === undefined)
			throw new Error("SocketModel's must have an id property");

		return app.defer(function(deferred) {
			var self = model,
				id = ko.unwrap(map.id),
				keys = Object.keys(map).exclude('id'),
				socketUpdating = false;

			self.id = ko.observable(id);

			keys.forEach(function(property) {
				self[property] = ko.observable(map[property]);
			});

			var setupModelSockets = function() {
				app.log("Registering SocketModel", self);

				var sockets = [];

				keys.forEach(function(property) {

					var eventName = getEventName(modelName, self.id(), property);

					//Subscribe to local changes
					self[property].subscribe(function(newValue) {
						if (socketUpdating) {
							return;
						}

						var post = newValue;
						if (typeof post === "string" || typeof post === "number")
							post = { __data__ : newValue};
						socketService.post(eventName, post);
					});

					//Subscribe to socket changes
					sockets.push(socket.on(eventName + '|changed', function(newValue) {
						socketUpdating = true;
						self[property](newValue);
						socketUpdating = false;
					}));
				});

				self.unsocket = function() {
					sockets.forEach(function(s) { s.destroy(); });
				};

				//Notify that setup has completed
				deferred.resolve(self);
			};

			//The ID may not exist yet, but it will be set by the first save 
			//Which should be occuring as a result of this creation, or soonafter
			//We will subscribe to the ID, and register the rest of the model when it arrives
			if (!map.id || id === 0 || id === '') {
				var sub;
				sub = self.id.subscribe(function(newValue) {
					if ( newValue === 0 || newValue === '')
						return; //We need a real value
					setupModelSockets();
					sub.dispose();
				});

				//Make empty functions for the socket
				self.unsocket = function() {};
			} else {
				setupModelSockets();
			}
		}).promise();
	};

	ko.socketSet = socketSet;
	ko.socketModel = socketModel;
});