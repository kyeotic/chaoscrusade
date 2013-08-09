define(['durandal/app', 'knockout', 'data/dataContext', 'models/skill'],
function(app, ko, dataContext, Skill) {
	var SkillEntry = function() {
		var self = this;

		self.skills = dataContext.skills;
		self.alignments = dataContext.alignments;
		self.characteristics = dataContext.characteristics;

		self.entrySkill = ko.observable(new Skill());

		self.addSkill = function() {
			var copy = ko.toJS(self.entrySkill());
			self.skills.push(new Skill(copy));
			self.entrySkill(new Skill());
		};

		self.removeSkill = function(skill) {
			self.skills.remove(skill);
		};

		self.filter = ko.observable('');
		self.filteredSkills = ko.computed(function() {
			var f = self.filter();
			return self.skills().filter(function(s) {
				return s.name().has(f);
			});
		});
	};

	return new SkillEntry();
});