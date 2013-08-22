define(['durandal/app', 'knockout'], 
function (app, ko) {
	return function(data) {
		var self = this;

		self.id = ko.observable(data.id || app.guid());
		self.username = data.username || app.loggedInUser().username();
		self.createdTime = data.createdTime || Date.create();
		self.text = data.text || '';
	};
});