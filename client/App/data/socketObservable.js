define(['durandal/app', 'modules/socket', 'services/socketService'], 
function(app, socket, socketService) {

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

	//Generate a standard name for the socket event by comibing the parameters
	var getEventName = function() {
		//Get all non-empty arguments
		var args = Array.prototype.slice.call(arguments).exclude(function(i) {
			return i === undefined || i === null || i === '';
		});
  		return args.join('|');
	};

	//Root sets do not pass a parentSetName or parentId
	//The event name will just filter them out
	var ObservableSet = function(setName, Constructor, parentSetName, parentId) {
		var set = ko.observableArray(),
			socketUpdating = false;

		if (parentId !== undefined && !ko.isObservable(parentId))
			throw new Error("Child Observable Sets must have observable parentId");

		var setupSet = function() {
			var eventName = getEventName(parentSetName, ko.unwrap(parentId), setName);

			app.log("Registering SocketSet " + setName);

			//Subscribe to socket
			var add = socket.on(eventName + "|added", function(newElement) {
				socketUpdating = true;
				set.push(new Constructor(newElement));
				socketUpdating = false;
			});

			var remove = socket.on(eventName + '|removed', function(oldElement) {
				var item = set().find(function(i) {
					return ko.unwrap(i.id) == oldElement.id;
				});

				socketUpdating = true;
				set.remove(item);
				socketUpdating = false;
			});

			//Publish to service
			set.subscribeArrayChanged(
				//Added
				function(newElement) {
					if (socketUpdating) {
						return;
					}
					socketService.put(eventName, newElement).then(function(response) {
						newElement.id(response);
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

			//Load data into set without tell the socketService that WE added it
			set.loadSet = function(data) {
				socketUpdating = true;
				set.map(data, Constructor);
				socketUpdating = false;		
			};

			//Load the set from the socket Api
			set.getSet = function() {
				return socketService.get(eventName)
						.then(function(response) {
							socketUpdating = true;
							set.map(response, Constructor);
							socketUpdating = false;	
							return set();
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
		if (parentId !== undefined && (parentId === '' || parentId === 0)) {
			var sub;
			sub = parentId.subscribe(function(newValue) {
				if (newValue === 0 || newValue === '')
					return; //We need a real value
				setupSet();
				sub.dispose();
			});

			//Make empty functions for the socket
			self.loadSet = function() {};
			self.unloadSet = function() {};
			self.unsocket = function() {};
		} else { //Otherwise setup now
			setupSet();
		}

		return set;
	};

	var ObservableModel = function(modelName, map) {
		var self = this,
			id = ko.unwrap(map.id);

		self.id = ko.observable(id);

		var setupModel = function() {
			app.log("Registering SocketModel " + modelName);

			var keys = Object.keys(map).exclude('id');
			var sockets = [];

			keys.forEach(function(property) {
				self[property] = ko.observable(map[property]);

				var eventName = getEventName(modelName, id, property),
					socketUpdating = false;

				sockets.push(socket.on(eventName, function(newValue) {
					socketUpdating = true;
					self[property](newValue);
					socketUpdating = false;
				}));
				
				self[property].subscribe(function(newValue) {
					if (socketUpdating) {
						return;
					}
					socketService.post(eventName, newValue);
				});
			});

			self.unsocket = function() {
				sockets.forEach(function(s) { s.destroy(); });
			};
		};

		//The ID doesn't exist yet, but it will be set by the first save 
		//Which should be occuring as a result of this creation, or soonafter
		//We will subscribe to the ID, and register the rest of the model when it arrives
		if (!map.id || id === 0 || id === '') {
			var sub;
			sub = self.id.subscribe(function(newValue) {
				if ( newValue === 0 || newValue === '')
					return; //We need a real value
				setupModel();
				sub.dispose();
			});

			//Make empty functions for the socket
			self.unsocket = function() {};
		} else {
			setupModel();
		}
		
	};

	return {
		Set: ObservableSet,
		Model: ObservableModel
	};
});