define(['services/http'], function(http) {
	var route = '/api/';
	return {
		get: function(eventName) {
			return http.get(route + eventName);
		},
		post: function(eventName, value) {
			return http.post(route + eventName, value);
		},
		put: function(eventName, value) {
			return http.put(route + eventName, value);
		},
		remove: function(eventName, value) {
			return http.remove(route + eventName + '|' + value);
		},
	};
});