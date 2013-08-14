define(['durandal/app', 'knockout', 'data/dataContext', 'data/rules', 'models/skill'],
function(app, ko, dataContext, rules, Skill) {
	var SkillEntry = function() {
		var self = this;

		self.skills = dataContext.skills;
		self.alignments = rules.alignments;
		self.characteristics = rules.characteristics;

		self.entrySkill = ko.observable(new Skill());

		self.addSkill = function() {
			var name = self.entrySkill().name().toLowerCase();
			var exists = self.skills().some(function (s) {
				return s.name().toLowerCase() === name;
			})

			if (exists) {
				app.showMessage('This skill already exists', 'Error');
			} else {
				var copy = ko.toJS(self.entrySkill());
				self.skills.push(new Skill(copy));
				self.entrySkill(new Skill());
			}			
		};

		self.removeSkill = function(skill) {
			self.skills.remove(skill);
		};

		self.filter = ko.observable('');
		self.filteredSkills = ko.computed(function() {
			var f = self.filter().toLowerCase();
			var filtered = self.skills().filter(function(s) {
				return s.name().toLowerCase().startsWith(f);
			});

			return filtered.sortBy(function(s) {
				return s.name();
			});
		}).extend({throttle: 250});
	};

	return new SkillEntry();
});