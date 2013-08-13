define(['durandal/app', 'knockout', 'data/dataContext', 'viewmodels/login', 
		'models/character', 'viewmodels/chatMessage', 'viewmodels/campaign/home',
		'viewmodels/campaign/character', 'viewmodels/campaign/settings'], 
function(app, ko, dataContext, login, Character, ChatMessage,
		 home, CharacterVm, settings) {
	var CampaignPage = function() {
		var self = this;

		self.activate = function(campaignId) {
			app.log('campaign page activating', arguments, dataContext.campaigns().length);
			dataContext.selectCampaign(campaignId);
			//app.log(dataContext.selectedCampaign().characters());
		};

		self.campaign = dataContext.selectedCampaign;

		self.isGm = ko.computed(function() {
			return self.campaign().gmId() === login.loggedInUser().id();
		});

		self.addCharacter = ko.command({
			execute: function() {
				var character = new Character({ 
					name: login.loggedInUser().username(),
					campaignId: self.campaign().id(),
					ownerId: login.loggedInUser().id()
				});
				self.campaign().characters.push(character);
			}
		});

		self.deleteCharacter = function(character) {
			self.campaign().characters.remove(character);
			self.navHome();
		};

		//View
		self.selectedCharacter = ko.observable(null);
		self.view = ko.observable(home);
		self.viewType = ko.computed(function() {
			var view = self.view();
			if (view === home)
				return 'home';
			if (view === settings)
				return 'settings';
			//We better be a fucking character
			return view.character.id();
		});

		self.navHome = function() { self.view(home); };
		self.navSettings = function() { self.view(settings); };
		self.navCharacter = function(character) {
			var isOwner = character.ownerId() === login.loggedInUser().id();
			self.view(new CharacterVm(character, self.isGm(), isOwner, self.navHome));
		};


		//Chat
		self.messageInput = ko.observable('');
		self.sendMessage = function(message) {
			self.campaign().chatMessages.push(new ChatMessage({text: self.messageInput()}));
			self.messageInput('');
		};
	};

	return new CampaignPage();
});