define(['durandal/app', 'knockout', 'plugins/router', 'data/dataContext',
		'login/login', 'campaign/addSkill'],
function(app, ko, router, dataContext, login, AddSkill) {
	return function() {
		var self = this;

		//Owner is GM OR Player, just a shorthand
		self.isGm = ko.observable(false);
		self.isOwner = ko.observable(false);
		self.isPlayer = ko.observable(false);

		self.activate = function(characterId) {
			var character = dataContext.selectedCampaign().characters().find(function(c) {
				return c.id() === characterId;
			});
			
			if (!character)
				return false;

			self.character = character;
			self.isGm(dataContext.selectedCampaign().gmId() === login.user().id());
			self.isPlayer(character.playerId() === login.user().id());
			self.isOwner(self.isPlayer() || self.isGm);
		};

		self.deleteCharacter = ko.command({
			execute: function() {
				dataContext.selectedCampaign().characters.remove(self.character);
				//navigate to campaign home
			},
			canExecute: function() {
				return self.isGm() || self.isOwner();
			}
		});

		self.addSkills = function() {
			new AddSkill(self.character).show();
		};
	};
});	