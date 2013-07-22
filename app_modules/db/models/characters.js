module.exports = function(db, models) {
	var setName = 'Characters';

	var set = new db.Schema({
		weaponSkill: Number,
		ballisticSkill: Number,
		strength: Number,
		toughness: Number,
		agility: Number,
		intelligence: Number,
		perception: Number,
		willpower: Number,
		fellowship: Number,
		infamy: Number,
		wounds: Number,
		corruption: Number,
		skills: [{ type: db.Schema.Types.ObjectId, ref: 'Skills'}]
	});

	//add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};