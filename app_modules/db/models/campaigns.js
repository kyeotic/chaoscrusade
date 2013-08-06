module.exports = function(db, models) {
	var setName = 'campaigns';

    var set = new db.Schema({
        //id and _id are creatd by the system
        gmId: db.Schema.Types.ObjectId,
        name: String,
        characters: [{ type: db.Schema.Types.ObjectId, ref: 'characters' }]
    });

    // Ensure virtual fields are serialised.
	set.set('toJSON', { virtuals: true });
	    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};