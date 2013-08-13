define(['durandal/app', 'knockout', 'data/dataContext', 'models/skill'], 
function(app, ko, dataContext, Skill) {

	/*
					Known	Trained	Experienced	Veteran
		True		100xp	200xp	400xp		600xp
		Allied		200xp	350xp	500xp		750xp
		Opposed		250xp	500xp	750xp		1000xp
	*/

	var patronCosts = {
		'true': [100, 200, 400, 600],
		alllied: [200, 350, 500, 750],
		Opposed: [250, 500, 750 , 1000]
	};

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

		//Todo, do this right
		self.characterAlignment = ko.computed(function() {
			return 'Tzeentch';
		})

		self.rankUpCost = ko.computed(function() {
			if (self.rank() === 4)
				return 0;
			var patronity = dataContext.patronStatus(self.characterAlignment(), self.alignment());
			//By getting the rank before we move up, we get the correct index
			return patronCosts[patronity][rank];
		});

		self.rankUp = function(currentAlignment) {
			if (self.rank() === 4)
				return;			
			self.rank(self.rank() + 1);
			self.['rank' + self.rank() + 'Xp'](self.rankUpCost());
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

		self.totalXp = ko.computed(function() {
			return [self.rank1Xp(), self.rank2Xp(), self.rank3Xp(), self.rank4Xp()].compact().sum();
		});
	};
});