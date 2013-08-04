define(['durandal/app', 'knockout'], function(app, ko) {
	var Skill = function(init) {
		var self = this;

		ko.socketModel(self, 'skill', {
			id: init.id || '',
			name: init.name || '',
			text: init.text || '',
			page: init.page || 0,
			alignment: init.alignment || '',
			characteristic: init.characteristic || ''
		})
	};

	return Skill;
});