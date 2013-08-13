define(['knockout', 'durandal/app', 'data/rules', 'models/skillAdvancement'],
function(ko, app, rules, SkillAdvancement){
	return function(data) {
		var self = this;

		var map = {
			id: data.id || '',
			name: data.name || '',
			campaignId: data.campaignId || '',
			ownerId: data.ownerId || '', 
			weaponSkill: data.weaponSkill || 0,
			ballisticSkill: data.ballisticSkill || 0,
			strength: data.strength || 0,
			toughness: data.toughness || 0,
			agility: data.agility || 0,
			intelligence: data.intelligence || 0,
			perception: data.perception || 0,
			willpower: data.willpower || 0,
			fellowship: data.fellowship || 0,
			infamy: data.infamy || 0,
			wounds: data.wounds || 0,
			woundsRemaining: data.woundsRemaining || 0,
			corruption: data.corruption || 0,
			xpGained: data.xpGained || 0
		};

		ko.socketModel(self, 'characters', map).then(function(result) {
			app.log("character loaded", result);
		});

		self.skills = ko.socketSet('skillAdvancements', SkillAdvancement, 'characters', self.id);

		//There are no consumers that need these loaded yet, but there may be?
		//Return a promise at that time
		self.load = function() {
			self.skills.loadSet();
		};

		self.xpRemaining = ko.computed(function() {
			return self.xpGained() - self.skills().sum(function(s) {
				s.totalXpCost();
			});
		});

		self.alignment = ko.computed(function() {
			var counts = {};

			//Count skills
			self.skills().forEach(function(s) {
				counts[s.alignment()] = (count[s.alignment()] || 0) + s.rank();
			});

			//Count talents
			//Count characteristic advancements
			//Count... other shit?

			//Subtract character offsets


			//Find highest and second highest patrons
			var maxPatron = '',
				max = 0, 
				max2 = 0;
			Object.keys(counts, function(patron, count) {
				if (count > max) {
					maxPatron = patron;
					max= count;
				} else if (count > max2) {
					max2 = count;
				}
			});

			//5 Higher than 2nd to align
			return max > (max2 + 4) ? maxPatron : 'Unaligned';
		});

		//Skills are always new, skill advancements always (should be) old
		self.canAffordSkill = function(skill) {
			var patronStatus = rules.getPatronStatus(self.alignment(), skill.alignment());
			return self.xpRemaining() - rules.getSkillCost(patronStatus, 1);
		};

		self.canAffordSkillUp = function(skillAdvancement) {
			return self.xpRemaining() - skillAdvancement.rankUpCost() >= 0;
		};

		self.addSkill = function(skill) {
			if (!self.canAffordSkill(skill)) {
				app.showMessage('You cannot afford this skill.', 'Error');
				return;
			}

			var skillAdvancement = new SkillAdvancement({
				characterId: self.id(),
				skillId: skill.id()
			});
		};

		self.removeSkill = function(skillAdvancement) {
			//XpRemaining will auto re-calc
			self.skills.remove(skillAdvancement);
		};
	};
});