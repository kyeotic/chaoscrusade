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
			return i !== undefined && i !== null && i !== '';
		});
  		return args.join('|');
	};

	//Root sets do not pass a parentSetName or parentId
	//The event name will just filter them out
	var ObservableSet = function(setName, constructor, parentSetName, parentId) {
		var self = this,
			eventName = getEventName(parentSetName, parentId, setName),
			set = ko.observableArray(),
			socketUpdating = fasle;

		//Subscribe to socket
		socket.on(eventName + "|added", function(newElement) {
			socketUpdating = true;
			set.push(new constructor(newElement));
			socketUpdating = false;
		});

		socket.on(eventName + '|removed', function(oldElement) {
			var item = model[property]().find(function(i) {
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
				if (socketUpdating)
					return;
				socketService.put(eventName, newElement).then(function(response) {
					newElement.id(response);
				});
			},
			//Removed
			function(oldElement) {
				if (socketUpdating)
					return;
				socketService.remove(eventName, ko.unwrap(oldElement.id));
			}
		);
	};

	var ObservableModel = function(modelName, map) {
		var self = this,
			id = ko.unwrap(map.id);

		if (!map.id || id === 0 || id === '')
			throw new Error("Socket Observables models must have a non-zero Id.");

		var keys = Object.keys(map).exclude('id');

		keys.forEach(function(property) {
			self[property] = ko.observable(map[property]);

			var eventName = getEventName(modelName, id, property),
				socketUpdating = false;

			socket.on(eventName, function(newValue) {
				socketUpdating = true;
				self[property](newValue);
				socketUpdating = false;
			});

			self[property].subscribe(function(newValue) {
				if (socketUpdating)
					return;
				socketService.post(eventName, newValue);
			});
		});
	};

	return {
		set: ObservableSet,
		model: ObservableModel
	};
});