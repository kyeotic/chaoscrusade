define(['modules/serviceBase'], function(serviceBase) {
	var route = '/api/';
	return {
		get: function(eventName) {
			return serviceBase.get(route + eventName);
		},
		post: function(eventName, value) {
			return serviceBase.post(route + eventName, value);
		},
		put: function(eventName, value) {
			return serviceBase.put(route + eventName, value);
		},
		remove: function(eventName, value) {
			return serviceBase.remove(route + eventName + '|' + value);
		},
	};
});