define(['durandal/app', 'knockout'], function(app, ko) {
	return function() {
		var self = this;

		self.isGm = ko.observable(false);
		self.isOwner = ko.observable(false);
		self.name = ko.observable('');
		self.abbr = ko.observable('');

		self.activate = function(config) {

			self.isGm(config.isGm || false);
			self.isOwner(config.isOwner || false);

			self.name(ko.unwrap(config.name));
			self.abbr(ko.unwrap(config.abbr));
			
			self.stat = config.stat;
		};
	};
});