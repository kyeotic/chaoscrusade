module.exports = function(db, models) {
    var set = new db.Schema({
        //id and _id are creatd by the system
        name: String,
        type: String,
        alignment: String,
        text: String,
        baseXpCost: Number,
        rulebookPage: Number
    });
    
    //add the models to our simplified models collection
    models.Rules = db.model('Rules', set);
};