define(['durandal/app', 'knockout', 'data/rules'], 
function(app, ko, rules, require) {

	//Stats function very similarly to skills
	//Changes made here may also apply to skills, especially those related to XP costs
	return function(data) {
		var self = this,
			data = data || {};

		var map = {
			id: data.id || '',
			characterId: data.characterId || '',
			name: data.name || '',
			baseValue: data.baseValue || 0,
			rank: data.rank || 0,
			rank1Xp: data.rank1Xp || 0,
			rank2Xp: data.rank2Xp || 0,
			rank3Xp: data.rank3Xp || 0,
			rank4Xp: data.rank4Xp || 0
		};

		ko.socketModel(self, 'statAdvancements', map);

		//The cost of ranking up for each patron status
		self.rankUpCost = ko.computed(function() {

			var rankUp = self.rank() + 1;
			if (rankUp === 5)
				return 0;
			
			return {
				'True': rules.getStatCost('True', rankUp),
				Allied: rules.getStatCost('Allied', rankUp),
				Opposed: rules.getStatCost('Opposed', rankUp)
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

		self.rankDown = ko.command({
			execute: function() {
				self['rank' + self.rank() + 'Xp'](0);
				self.rank(self.rank() - 1);
			},
			canExecute: function() {
				return self.rank() > 1;
			}
		});

		self.alignment = ko.computed(function() {
			return rules.statAlignments[self.name()];
		});

		self.totalXpCost = ko.computed(function() {
			return [
				self.rank1Xp().toNumber(), 
				self.rank2Xp().toNumber(), 
				self.rank3Xp().toNumber(), 
				self.rank4Xp().toNumber()
			].compact().sum();
		});

		//The value should not be writeable
		//If you need to change the value, use the baseValue
		self.value = ko.computed(function() {
			return self.baseValue().toNumber() + (self.rank().toNumber() * 5);
		});
	};
});