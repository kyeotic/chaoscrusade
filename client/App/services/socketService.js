define(['modules/serviceBase'], function(serviceBase) {
	return {
		post: function(eventName, value) {
			serviceBase.post('/socketApi/' + eventName, value);
		},
		put: function(eventName, value) {
			serviceBase.put('/socketApi/' + eventName, value);
		},
		remove: function(eventName, value) {
			serviceBase.remove('/socketApi/' + eventName, value);
		},
	};
});