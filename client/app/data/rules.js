define(function() {
	var self = {
		maxStatRank: 4,
		maxSkillRank: 4
	};

	self.alignments = [
		'Unaligned',
		'Khorne',
		'Tzeentch',
		'Nurgle',
		'Slaanesh'		
	];

	self.stats = [
		'Weapon Skill',
		'Ballistic Skill',
		'Strength',
		'Toughness',
		'Agility',
		'Intelligence',
		'Perception',
		'Willpower',
		'Fellowship'
	];

	self.getPatronStatus = function(currentAlignment, testingAlignment) {
		//Ensure the order checks ahead make sense
		var align = [currentAlignment, testingAlignment].sortBy();

		if (align.any('Unaligned'))
			return 'Allied';

		if (currentAlignment === testingAlignment)
			return 'True';
		
		//This covers all the options, since we know the sorting can't produce Tzeentch
		if (align[0] === 'Khorne')
			return align[1] === 'Nurgle' ? 'Allied' : 'Opposed';
		else if (align[0] === 'Nurgle')
			return 'Opposed';
		else if (align[0] === 'Slaanesh')
			return 'Allied';
		else
			throw new Error("Illegal alignment: " + currentAlignment);
	};

	/*
					Known	Trained	Experienced	Veteran
		True		100xp	200xp	400xp		600xp
		Allied		200xp	350xp	500xp		750xp
		Opposed		250xp	500xp	750xp		1000xp
	*/

	var skillRankCosts = {
		'True': [100, 200, 400, 600],
		Allied: [200, 350, 500, 750],
		Opposed: [250, 500, 750 , 1000]
	};

	self.getSkillCost = function(patronStatus, rank) {
		return skillRankCosts[patronStatus][rank - 1];
	};

	var statRankCosts = {
		'True': [100, 250, 500, 750],
		Allied: [250, 500, 750, 1000],
		Opposed: [500, 750, 1000 , 2500]
	};

	self.getstatCost = function(patronStatus, rank) {
		return statRankCosts[patronStatus][rank - 1];
	};

	var talentCosts = {
		'True': [200, 300, 400],
		Allied: [250, 500, 750],
		Opposed: [500, 750, 1000]
	};

	self.getTalentCost = function(patronStatus, tier) {
		return talentCosts[patronStatus][tier -1];
	};

	return self;
});