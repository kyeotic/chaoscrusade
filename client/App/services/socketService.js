define(['modules/serviceBase'], function(serviceBase) {
	var route = '/api/';
	return {
		post: function(eventName, value) {
			serviceBase.post(route + eventName, value);
		},
		put: function(eventName, value) {
			serviceBase.put(route + eventName, value);
		},
		remove: function(eventName, value) {
			serviceBase.remove(route + eventName + '/' + value);
		},
	};
});