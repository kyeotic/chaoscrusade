define(['durandal/app', 'knockout', 'data/dataContext', 'viewmodels/login'],
function(app, ko, dataContext, login) {
	var self = {};

	self.campaign = dataContext.selectedCampaign;

	self.isGm = ko.computed(function() {
		return self.campaign().gmId() === login.loggedInUser().id();
	});

	return self;
});