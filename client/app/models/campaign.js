define(['durandal/app', 'knockout', 'models/character', 'services/campaignService'],
function(app, ko, Character, campaignService) {
	var Campaign = function(init) {
		var self = this;

		var map = {
			id: init.id || '',
			name: init.name || '',
			gmId: init.gmId || ''
		};

		ko.socketModel(self, 'campaigns', map);

		self.characters = ko.socketSet('characters', Character, 'campaigns', self.id);

		self.load = function() {
			return self.characters.loadSet();
		};

		self.unload = function() {
			self.characters.unloadSet();
		};

		self.charactersLoaded = ko.computed(function() {
			return self.characters().length > 0;
		});
	};

	return Campaign;
});	