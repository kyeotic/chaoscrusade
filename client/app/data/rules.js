define(function() {
	var self = {};

	self.alignments = [
		'Unaligned',
		'Khorne',
		'Tzeentch',
		'Nurgle',
		'Slaanesh'		
	];

	self.characteristics = [
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
		if (currentAlignment === testingAlignment)
			return 'true';

		//Ensure the order checks ahead make sense
		var align = [currentAlignment, testingAlignment].sortBy();

		if (align.any('Unaligned'))
			return 'allied';

		//This covers all the options, since we know the sorting can't produce Tzeentch
		if (align[0] === 'Khorne')
			return align[1] === 'Nurgle' ? 'allied' : 'opposed';
		else if (align[0] === 'Nurgle')
			return 'opposed';
		else if (align[0] === 'Slaanesh')
			return 'allied';
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
		'true': [100, 200, 400, 600],
		allied: [200, 350, 500, 750],
		opposed: [250, 500, 750 , 1000]
	};

	self.getSkillCost = function(patronStatus, rank) {
		return skillRankCosts[patronStatus][rank - 1];
	};

	return self;
});