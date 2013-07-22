module.exports = function(db, models) {
	var setName = 'Skills';

    var set = new db.Schema({
        //id and _id are creatd by the system
        name: String,
        text: String,
        page: Number,
        alignment: String,
        characteristic: String
    });
    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};