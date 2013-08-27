define(['services/http'], function(http) {
	var route = '/api/';

	var wrapJsonDoc = function(input) {
		var data = input;
		if (typeof data === "string" || typeof data === "number")
			data = { __data__ : input};
		return data;
	}

	return {
		get: function(eventName) {
			return http.get(route + eventName);
		},
		post: function(eventName, value) {
			return http.post(route + eventName, wrapJsonDoc(value));
		},
		put: function(eventName, value) {
			return http.put(route + eventName, wrapJsonDoc(value));
		},
		remove: function(eventName, value) {
			return http.remove(route + eventName + '|' + value);
		},
	};
});