define(['durandal/app'],
function(app) {

	var DataContext = function() {
		var self = this;

		self.campaigns = ko.observableArray();

	};
	
	return new DataContext();
});