define(['durandal/app', 'knockout', 'models/character', 'services/campaign', 'chatMessage/chatMessage'],
function(app, ko, Character, campaignService, ChatMessage) {
	var Campaign = function(init) {
		var self = this,
			init = init || {};

		var map = {
			id: init.id || '',
			name: init.name || '',
			gmId: init.gmId || '',
			gmUsername: init.gmUsername || ''
		};

		ko.socketModel(self, 'campaigns', map);

		self.characters = ko.socketSet('characters', Character, 'campaigns', self.id);
		self.chatMessages = ko.socketSet('chat', ChatMessage, 'campaigns', self.id);

		self.load = function() {
			return app.deferAll([
				self.characters.loadSet().then(function(set) {

					//We don't need to return this
					//The characters don't need to be loaded for the campaign
					self.characters().forEach(function(c) {
						c.load();
					});
				}),
				self.chatMessages.loadSet()
			]);
		};

		self.unload = function() {
			self.characters.unloadSet();
			self.chatMessages.unloadSet();
		};

		self.charactersLoaded = ko.computed(function() {
			return self.characters().length > 0;
		});
	};

	return Campaign;
});	