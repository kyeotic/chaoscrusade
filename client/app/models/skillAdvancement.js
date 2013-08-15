define(['durandal/app', 'knockout', 'data/rules', 'models/skill', 'require', 'data/dataContext'], 
function(app, ko, rules, Skill, require) {

	return function(data) {
		var self = this,
			data = data || {},
			dataContext = require('data/dataContext');

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
				'True': rules.getSkillCost('True', rankUp),
				Allied: rules.getSkillCost('Allied', rankUp),
				Opposed: rules.getSkillCost('Opposed', rankUp)
			};
		});

		self.getRankUpCost = function(characterAlignment) {
			var patronStatus = rules.getPatronStatus(characterAlignment, self.alignment());
			return self.rankUpCost()[patronStatus];
		};

		//Rank up the skill and add the xp cost of the patron status
		self.rankUp = function(characterAlignment) {
			if (self.rank() === 4)
				return;

			var patronStatus = rules.getPatronStatus(characterAlignment, self.alignment());

			var newRank = self.rank() + 1;

			var rankXp = 'rank' + newRank + 'Xp';

			//We have to get the rankUpCost BEFORE rankingup,
			//since the rankUpCost shows the cost to rankUp from THE CURRENT RANK
			self[rankXp](self.rankUpCost()[patronStatus]);

			self.rank(newRank);

			return self[rankXp]();
		};

		self.skill = ko.computed(function() {
			return skill = dataContext.skills().find(function(s) {
				return s.id() === self.skillId();
			}) || new Skill();
		});

		self.name = ko.computed(function() {
			return self.skill().name();
		});

		self.alignment = ko.computed(function() {
			return self.skill().alignment();
		});

		self.totalXpCost = ko.computed(function() {
			return [
				self.rank1Xp().toNumber(), 
				self.rank2Xp().toNumber(), 
				self.rank3Xp().toNumber(), 
				self.rank4Xp().toNumber()
			].compact().sum();
		});
	};
});