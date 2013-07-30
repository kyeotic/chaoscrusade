
module.exports = function(db, models) {
    var users = new db.Schema({
        //id and _id are creatd by the system
        firstName: String,
        lastName: String,
        username: String,
        usernameLower: String,
        passwordHash: String,
        role: String
    });

    // Ensure virtual fields are serialised.
    users.set('toJSON', { virtuals: true });
    
    //add the models to our simplified models collection
    models.Users = db.model('Users', users);
};