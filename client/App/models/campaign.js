define(['models/character'],
function(Character) {
	var Campaign = function(init) {
		var self = this;

		self.id = ko.observable();
		self.name = ko.observable();
		self.gmId = ko.observable();
		self.characters = ko.observableArray();

		self.update = function(data){
			data  = data || {};
			self.id(data.id || data._id || self.id() || '');
			self.name(data.name || self.name() || '');
			self.gmId(data.gmId || self.gmId() || '');
			
			if(data.characters && data.characters.length > 0) {
				self.characters.map(data, Character, { purge: false });
			}
		};
		self.update(init);
	};

	return Campaign;
});	