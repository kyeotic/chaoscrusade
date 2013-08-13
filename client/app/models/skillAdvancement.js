define(['durandal/app', 'knockout', 'data/dataContext', 'models/skill'], 
function(app, ko, dataContext, Skill) {

	return function(data) {
		var self = this,
			data = data || {};

		var map = {
			id: data.id || '',
			characterId: data.characterId || '',
			skillId: data.skillId || '',
			rank: data.rank || 0,
			rank1Xp: data.rank1Xp || 0,
			rank2Xp: data.rank2Xp || 0,
			rank3Xp: data.rank3Xp || 0,
			rank4Xp: data.rank4Xp || 0
		};

		ko.socketModel(self, 'skillAdvancements', map);

		//The cost of ranking up for each patron status
		self.rankUpCost = ko.computed(function() {

			var rankUp = self.rank() + 1;
			if (rankUp === 5)
				return 0;
			
			return {
				'true': dataContext.getSkillCost('true', rankUp),
				allied: dataContext.getSkillCost('allied', rankUp),
				opposed: dataContext.getSkillCost('opposed', rankUp)
			};
		});

		//Rank up the skill and add the xp cost of the patron status
		self.rankUp = function(patronStatus) {
			if (self.rank() === 4)
				return;			
			
			self.rank(self.rank() + 1);

			var rankXp = 'rank' + self.rank() + 'Xp';
			self[rankXp](self.rankUpCost()[patronStatus]);

			return self[rankXp]();
		};

		self.skill = ko.computed(function() {
			return skill = dataContext.skills().find(function(s) {
				return s.id() === self.skillId();
			}) || new Skill();
		});

		self.name = ko.computed(function() {
			return self.skill.name();
		});

		self.alignment = ko.computed(function() {
			return self.skill().alignment();
		});

		self.totalXpCost = ko.computed(function() {
			return [self.rank1Xp(), self.rank2Xp(), self.rank3Xp(), self.rank4Xp()].compact().sum();
		});
	};
});