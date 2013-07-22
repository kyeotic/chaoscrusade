define(['durandal/app'], function(app) {
	var Skill = function(init) {
		var self = this;

		self.id = ko.observable(init.id || 0);
		self.name = ko.observable(init.name || '');
		self.page = ko.observable(init.page || 0);
		self.alignment = ko.observable(init.alignment || '');
		self.characteristic = ko.observable(init.characteristic || '');
	};

	return Skill;
});