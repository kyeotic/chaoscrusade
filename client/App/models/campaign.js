define(['durandal/app', 'data/socketObservable', 'models/character', 'services/campaignService'],
function(app, Character, campaignService) {
	var Campaign = function(init) {
		var self = this;

		self.id = ko.observable(data.id || data._id || 0);
		self.name = ko.observable(data.name || '');
		self.gmId = ko.observable(data.gmId || '');
		self.charactersLoaded = ko.observable(false);

		var initCharacters = [];
		if (init.characters || init.characters.length > 0) {
			self.charactersLoaded(true);
			initCharacters = ko.utils.arrayMap(init.characters, function(c) {
				return new Character(c);
			});
		};

		self.characters = ko.observableArray(initCharacters);

		self.loadCharacters = function() {
			if (self.id() === 0)
				return;
			campaignService.getCharacters(self.id())
				.then(function(characters) {
					self.characters.map(characters, Character);
				}).fail(app.log).done();
		};
	};

	return Campaign;
});	