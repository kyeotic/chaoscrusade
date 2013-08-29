define(['knockout', 'durandal/app', 'data/rules', 'models/skillAdvancement', 'models/statAdvancement'],
function(ko, app, rules, SkillAdvancement, StatAdvancement){
	return function(data) {
		var self = this;

		var map = {
			id: data.id || '',
			name: data.name || '',
			campaignId: data.campaignId || '',
			ownerId: data.ownerId || '',
			infamy: data.infamy || 0,
			wounds: data.wounds || 0,
			woundsRemaining: data.woundsRemaining || 0,
			corruption: data.corruption || 0,
			xpGained: data.xpGained || 0
		};

		ko.socketModel(self, 'characters', map).then(function(result) {
			app.log("character loaded", result);
		});

		self.skillAdvancements = ko.socketSet('skillAdvancements', SkillAdvancement, 'characters', self.id);
		self.statAdvancements = ko.socketSet('statAdvancements', StatAdvancement, 'characters', self.id);

		//There are no consumers that need these loaded yet, but there may be?
		//Return a promise at that time
		self.load = function() {
			self.skillAdvancements.loadSet().done();
		};

		self.xpRemaining = ko.computed(function() {
			var skillCosts = self.skillAdvancements().sum(function(s) {
				return s.totalXpCost().toNumber();
			});
			var statCosts = self.statAdvancements().sum(function(s) {
				return s.totalXpCost().toNumber();
			});

			return self.xpGained().toNumber() - skillCosts - statCosts;
		});

		self.alignment = ko.computed(function() {
			var counts = {};

			//Count skillAdvancements
			self.skillAdvancements().forEach(function(s) {
				counts[s.alignment()] = (counts[s.alignment()] || 0) + s.rank().toNumber();
			});

			//Count talents
			//Count characteristic advancements
			self.statAdvancements().forEach(function(s) {
				counts[s.alignment()] = (counts[s.alignment()] || 0) + s.rank().toNumber();
			});

			//Count... other shit?

			//Subtract character offsets

			delete counts.Unaligned;
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
			return max >= (max2 + rules.alignmentThreshold) ? maxPatron : 'Unaligned';
		});

		/*
			Stats
		*/

		//Create the initial stats collection
		self.initStats = ko.command({
			execute: function() {
				rules.stats.forEach(function(s) {
					var stat = new StatAdvancement({
						characterId: self.id(),
						name: s
					});
					self.statAdvancements.push(stat);
				});
			},
			canExecute: function() {
				return self.statAdvancements().length == 0;
			}
		});

		self.canAffordStatUp = function(statAdvancement) {
			return 
		};

		/*
			Skills
		*/

		//skills are always new, skill advancements always (should be) old
		self.canAffordSkill = function(skill) {
			var patronStatus = rules.getPatronStatus(self.alignment(), skill.alignment());
			return self.xpRemaining() - rules.getSkillCost(patronStatus, 1);
		};

		self.canAffordSkillUp = function(skillAdvancement) {
			var xpRemaining = self.xpRemaining();
			var patronStatus = rules.getPatronStatus(self.alignment(), skill.alignment());
			var xpCost = skillAdvancement.rankUpCost()[patronStatus];

			if (skillAdvancement.rank() === rules.maxSkillRank)
				return false;
			if (xpCost === 0)
				return false;
			return xpRemaining - xpCost >= 0;
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

			skillAdvancement.rankUp(self.alignment());

			self.skillAdvancements.push(skillAdvancement);
		};

		self.rankUpSkill = function(skillAdvancement) {
			if (!self.canAffordSkillUp(skillAdvancement)) {
				app.showMessage('You cannot afford this skill up.', 'Error');
				return;
			}

			skillAdvancement.rankUp(self.alignment());
		};

		self.rankDownSkill = function(skillAdvancement) {
			skillAdvancement.rankDown();
		};

		self.removeSkill = function(skillAdvancement) {
			//XpRemaining will auto re-calc
			self.skillAdvancements.remove(skillAdvancement);
		};
	};
});