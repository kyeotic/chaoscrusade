define(['durandal/app', 'data/socketObservable', 'models/character', 'services/campaignService'],
function(app, socketObservable, Character, campaignService) {
	var Campaign = function(init) {
		var self = this;

		var map = {
			id: data.id || data._id || '',
			name: data.name || '',
			gmId: data.gmId || ''
		};

		socketObservable.Model.call(self, 'campaign', map);

		self.characters = socketObservable.Set('character', Character, 'campaign', self.id());

		self.loadCharacters = function() {
			campaignService.getCharacters(self.id())
				.then(function(characters) {
					self.characters.loadSet(characters);
				})
				.fail(app.log).done();
		};

		self.charactersLoaded = ko.computed(function() {
			return self.characters().length > 0;
		});
	};

	return Campaign;
});	