define([],
function() {
	var Rule = function(init) {
		var self = this;

		self.name = ko.observable("");
		self.type = ko.observable("");
		self.text = ko.observable("");
		self.alignment = ko.observable("");
		self.baseXpCost = ko.observable("");
		self.rulebookPage = ko.observable("");

		self.update = function(data){
			self.name(data.name || self.name() || '');
			self.type(data.type || self.type() || '');
			self.text(data.text || self.text() || '');
			self.alignment(data.alignment || self.alignment() || '');
			self.baseXpCost(data.baseXpCost || self.baseXpCost() || 0);
			self.rulebookPage(data.rulebookPage || self.rulebookPage() || 0);
		};
		self.update(init);
	};

	Rule.types = [
		'Skill',
		'Talent',
		'Psychic Power',
		'Trait',
		'Reward of the Gods',
		'Gift of the Gods',
		'Gear',
		'',
		'',
		'',
		'',
		
	];

	return Rule;
});