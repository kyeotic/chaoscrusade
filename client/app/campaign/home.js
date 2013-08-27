define(['durandal/app', 'knockout', 'data/dataContext', 'login/login'],
function(app, ko, dataContext, login) {
	var self = {};

	self.campaign = ko.computed(function() {
		return dataContext.selectedCampaign();
	});

	self.isGm = ko.computed(function() {
		return self.campaign().gmId() === login.loggedInUser().id();
	});

	self.addXpEntry = ko.observable(0);
	self.addXp = function() {
		var xp = self.addXpEntry().toNumber();
		xp = Object.isNaN(xp) ? 0 : xp;
		self.campaign().characters().forEach(function(c) {
			c.xpGained(c.xpGained().toNumber() + xp);
		});
		self.addXpEntry(0);
	};


	self.addItem = function() {
		var item = ['Test', 'Again', 'More', 'Please'].sample();
		self.campaign().items.push(item);
	};

	self.removeItem = function(item){
		self.campaign().items.remove(item);
	}

	return self;
});