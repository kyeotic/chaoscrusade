define(['knockout', 'durandal/app',],
function(ko, app){
	return function(data) {
		var self = this;

		var map = {
			id: data.id || '',
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
			corruption: data.corruption || 0
		};

		ko.socketModel(self, 'character', map).then(function(result) {
			app.log("character loaded", result);
		});
	};
});