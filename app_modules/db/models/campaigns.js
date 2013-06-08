module.exports = function(db, models) {
	var setName = 'Campaigns';

    var set = new db.Schema({
        //id and _id are creatd by the system
        gmId: Objectid,
        name: String,
        characters: [Objectid]
    });
    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};