var mongoose = require('mongoose');

if (process.env.SERVER === "PROD"){
	mongoose.connect('mongodb://tyrsius:' + process.env.DBPASS + '@localhost/chaoscrusade');
} else
	mongoose.connect('mongodb://serviceUser:prototransgenesis@linus.mongohq.com:10056/chaoscrusade');
//mongoose.connect('mongodb://@localhost/chaoscrusade');
var models = {};

//Setup Schema
require('./models/users')(mongoose, models);
require('./models/campaigns')(mongoose, models);
require('./models/characters')(mongoose, models);
require('./models/skills')(mongoose, models);

//console.log(models.Campaigns.schema.paths);
//console.log(models.Campaigns.schema.tree.characters[0]);

module.exports = models;