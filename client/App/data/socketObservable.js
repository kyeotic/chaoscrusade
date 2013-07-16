define(['durandal/app', 'modules/socket', 'services/socketService'], 
function(app, socket, socketService) {

	//Generate a standard name for the socket event by comibing the parameters
	var eventNamePrefix = function(modelType, modelId, property) {
		return modelType + "|" + modelId + "|" + property;
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

		var publishCollectionChanged = function(model, property, eventName, isTyped) {
			model[property].subscribeArrayChanged(
				//Added
				function(newElement) {
					if (socketUpdating)
						return; //Don't publish changes we received from the socket
					socketService.put(eventName, newElement);
				},
				//Removed
				function(oldElement) {
					if (socketUpdating)
						return;

					//if typed, we need to send the id, not the value of the element
					//If untyped the oldElement will just be a value, which we will send whole
					socketService.remove(eventName, isTyped ? ko.unwrap(oldElement.id) : oldElement);
				}
			);
		}

		//Subcribe to socket methods for an array's add and remove element events
		//Using the supplied constructor to transoform the data first
		var subscribeToTypedCollection = function(modelType, model, modelId, property, constructor, value) {

			//The constructor must return an object with an id property
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
				//find the item by id, a required prop for typed items
				var item = model[property]().find(function(i) {
					return ko.unwrap(i.id) == oldElement.id;
				});

				socketUpdating = true;
				model[property].remove(item);
				socketUpdating = false;
			});

			//Publish to service
			publishCollectionChanged(model, property, eventName, true);
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
			publishCollectionChanged(model, property, eventName, false);
		};

		//Subscribe to socket method for a property's changed event
		var subscribeToProperty = function(modelType, model, modelId, property, value) {
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