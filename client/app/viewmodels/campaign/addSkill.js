define(['durandal/app', 'plugins/dialog', 'knockout', 'data/dataContext', 'data/rules'],
function(app, dialog, ko, dataContext, rules) {
	return function(character) {
		var self = this;

		self.show = function() {
			return app.showDialog(self);
		};

		self.cancel = function() {
			dialog.close(self, false);
		};

		self.patronStatus = function(skill) {
			return rules.getPatronStatus(character.alignment(), skill.alignment());
		};

		self.xpCost = function(skill) {
			return rules.getSkillCost(self.patronStatus(skill), 1);
		};

		self.addSkill = function(skill) {
			if (!character.canAffordSkill(skill)) {
				app.showMessage('You cannot afford this skill.', 'Error');
				return;
			}

			character.addSkill(skill);
			dialog.close(self, true);
		};

		self.filter = ko.observable('');

		var skills = dataContext.skills().filter(function(s) {
			return character.canAffordSkill(s);
		});

		self.skills = ko.computed(function() {
			var filter = self.filter().toLowerCase();
			return skills.filter(function(s) {
				return s.name().toLowerCase().startsWith(filter);
			})
		});
	};
});