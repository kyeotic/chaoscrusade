define(['knockout', 'durandal/app', 'models/skillAdvancement'],
function(ko, app, SkillAdvancement){
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
			xpGained: data.xpGained || 0,
			xpRemaining: data.xpRemaining || 0
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
	};
});