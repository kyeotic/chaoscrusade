define(['durandal/app', 'knockout'], function(app, ko) {
	var Skill = function(init) {
		var self = this,
			init = init || {};

		var map = {
			id: init.id || '',
			name: init.name || '',
			text: init.text || '',
			page: init.page || 0,
			alignment: init.alignment || '',
			characteristic: init.characteristic || ''
		};

		ko.socketModel(self, 'skills', map);
	};

	return Skill;
});