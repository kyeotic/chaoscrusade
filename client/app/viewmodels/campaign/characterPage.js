define(['durandal/app', 'knockout', 'plugins/router', 'data/dataContext',
		'viewmodels/login', 'viewmodels/campaign/addSkill'],
function(app, ko, router, dataContext, login, AddSkill) {
	return function() {
		var self = this;

		self.activate = function(characterId) {

			app.log('activating', characterId);
			var character = dataContext.selectedCampaign().characters().find(function(c) {
				return c.id() === characterId;
			});

			app.log('character', character)

			if (!character)
				return false;

			self.character = character;
			self.isGm = dataContext.selectedCampaign().gmId() === login.user().id();
			self.isOwner = character.ownerId() === login.user().id() && !self.isGm;
		};

		self.deleteCharacter = ko.command({
			execute: function() {
				dataContext.selectedCampaign().characters.remove(self.character);
				//navigate to campaign home
			},
			canExecute: function() {
				return self.isGm || self.isOwner;
			}
		});

		self.addSkills = function() {
			new AddSkill(self.character).show();
		};
	};
});	