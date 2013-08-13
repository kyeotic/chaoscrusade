define(['durandal/app', 'knockout'], function(app, ko) {
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
	};
});