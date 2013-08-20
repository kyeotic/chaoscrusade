define(['durandal/app', 'knockout'], function(app, ko) {
	
	var ctor = function() {	};

	ctor.prototype.activate = function(settings) {
		this.isAuthorized = settings.auth;
		this.value = settings.value;
	};

	return ctor;
});