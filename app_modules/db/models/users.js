
module.exports = function(db, models) {
    var users = new db.Schema({
        //id and _id are creatd by the system
        firstName: String,
        lastName: String,
        userName: String,
        passwordHash: String
    });
    
    //add the models to our simplified models collection
    models.Users = db.model('Users', users);
};