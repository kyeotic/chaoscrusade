define(['durandal/app', 'data/socketObservable'], function(app) {
	var Skill = function(init) {
		var self = this;

		socketObservable.Model.call(self, 'skill', {
			id: init.id || init._id || '',
			name: init.name || '',
			text: init.text || '',
			page: init.page || 0,
			alignment: init.alignment || '',
			characteristic: init.characteristic || ''
		})
	};

	return Skill;
});