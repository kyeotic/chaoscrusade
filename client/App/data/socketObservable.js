define(['durandal/app', 'modules/socket', 'services/socketService'], 
function(app, socket, socketService) {



	//Generate a standard name for the socket event by comibing the parameters
	var eventNamePrefix = function() {
		//Get all non-empty arguments
		var args = Array.prototype.slice.call(arguments).exclude('');
  		return args.join('|');
	};

	//Walk the model and subscribe to 
	var setupSocketSubcriber = function(config) {
		//unwrap config
		var model = config.model,
			modelId = config.modelId,
			modelType = config.modelType,
			properties = config.properties;


		//Create tracking property to allow subscriptions to check
		var socketUpdating = false;

		//Subcribe to socket methods for an array's add and remove element events
		//Using the supplied constructor to transoform the data first
		var subscribeToTypedCollection = function(modelType, model, modelId, property, constructor, value) {

			//The constructor must return an object with an id property an dupdate method
			var testItem = new constructor();
			if (!testItem.id)
				throw new Error("Typed items must have an Id property to use pub/sub");
			
			model[property] = ko.observableArray(value);

			var eventName = eventNamePrefix(modelType, modelId, property);

			//Subscribe to socket
			socket.on(eventName + "|added", function(newElement) {
				socketUpdating = true;
				model[property].push(new constructor(newElement));
				socketUpdating = false;
			});

			socket.on(eventName + '|removed', function(oldElement) {
				var item = model[property]().find(function(i) {
					return ko.unwrap(i.id) == oldElement.id;
				});

				socketUpdating = true;
				model[property].remove(item);
				socketUpdating = false;
			});

			//Publish to service
			model[property].subscribeArrayChanged(
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

		//Subcribe to socket methods for an array's add and remove element events
		var subscribeToCollection = function(modelType, model, modelId, property, value) {
			model[property] = ko.observableArray(value);

			var eventName = eventNamePrefix(modelType, modelId, property);

			//Subscribe to socket
			socket.on(eventName + "|added", function(newElement) {
				socketUpdating = true;
				model[property].push(newElement);
				socketUpdating = false;
			});

			socket.on(eventName + '|removed', function(oldElement) {
				socketUpdating = true;
				model[property].remove(oldElement);
				socketUpdating = false;
			});

			//Publish to service
			model[property].subscribeArrayChanged(
				//Added
				function(newElement) {
					if (socketUpdating)
						return;
					socketService.put(eventName, newElement);
				},
				//Removed
				function(oldElement) {
					if (socketUpdating)
						return;
					socketService.remove(eventName,oldElement);
				}
			);
		};

		//Subscribe to socket method for a property's changed event
		var subscribeToProperty = function(modelType, model, *, property, value) {
			model[property] = ko.observable(value);

			var eventName = eventNamePrefix(modelType, modelId, property) + '|changed';
			socket.on(eventName, function(newValue) {
				socketUpdating = true;
				model[property](newValue);
				socketUpdating = false;
			});

			model[property].subscribe(function(newValue) {
				if (socketUpdating)
					return;
				socketService.post(eventName, newValue);
			})
		};

		var keys = Object.keys(properties);

		//Create observable properties on the model with socket pub/sub
		keys.forEach(function(property) {
			if (Object.isObject(properties[property]) {
				subscribeToTypedCollection(modelType, model, modelId, property, properties[property].type,  properties[property].value);
			} else if (Object.isArray(properties[property]) {
				subscribeToCollection(modelType, model, modelId, property, properties[property]);
			} else {
				subscribeToProperty(modelType, model, modelId, property, properties[property]);
			}
		});		
	};

	return setupSocketSubcriber;
});