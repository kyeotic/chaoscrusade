define(['durandal/app', 'knockout', 'data/dataContext'],
function(app, ko, dataContext, login) {
	return function(character, isGm, isOwner, exit) {
		var self = this;

		self.isGm = isGm;
		self.isOwner = isOwner;

		self.deleteCharacter = ko.command({
			execute: function() {
				dataContext.selectedCampaign().characters.remove(character);
				exit();
			},
			canExecute: function() {
				return isGm || isOwner;
			}
		});

		self.character = character;
	};
});	