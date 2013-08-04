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
			socketUpdating = false,
			eventName = getEventName(parentSetName, ko.unwrap(parentId), setName);;

		if (parentId !== undefined && !ko.isObservable(parentId))
			throw new Error("Child Observable Sets must have observable parentId");

		//Publish to service
		set.subscribeArrayChanged(
			//Added
			function(newElement) {
				if (socketUpdating) {
					return;
				}
				socketService.put(eventName, newElement).then(function(response) {
					newElement.id(response.id);
				});
			},
			//Removed
			function(oldElement) {
				if (socketUpdating) {
					return;
				}
				socketService.remove(eventName, ko.unwrap(oldElement.id));
			}
		);

		var setupSetSockets = function() {
			
			app.log("Registering SocketSet", eventName);

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
			set.loadSet = function(data) {
				//Load the data param
				if (data) {
					socketUpdating = true;
					set.map(data, Constructor);
					socketUpdating = false;	
				} else { //Or load the set from the service
					return socketService.get(eventName)
						.then(function(response) {
							socketUpdating = true;
							set.map(response, Constructor);
							socketUpdating = false;	
							return set;
						});
				}
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
		if (parentId !== undefined && (parentId === '' || parentId === 0)) {
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
		var self = model,
			id = ko.unwrap(map.id),
			keys = Object.keys(map).exclude('id'),
			socketUpdating = false;

		self.id = ko.observable(id);

		keys.forEach(function(property) {
				self[property] = ko.observable(map[property]);
				
				self[property].subscribe(function(newValue) {
					if (socketUpdating) {
						return;
					}

					//The ID might be getting populated after this is run
					//We don't want to close over the ID value, we need to get it fresh
					var eventName = getEventName(modelName, self.id(), property);
					socketService.post(eventName, newValue);
				});
			});

		var setupModelSockets = function() {
			app.log("Registering SocketModel", self);

			var sockets = [];

			keys.forEach(function(property) {

				var eventName = getEventName(modelName, self.id(), property);

				sockets.push(socket.on(eventName, function(newValue) {
					socketUpdating = true;
					self[property](newValue);
					socketUpdating = false;
				}));

			});

			self.unsocket = function() {
				sockets.forEach(function(s) { s.destroy(); });
			};
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
		
	};

	ko.socketSet = socketSet;
	ko.socketModel = socketModel;
});