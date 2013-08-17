var fs = require('fs'),
	mongoose = require('mongoose'),
	modelsDir = __dirname + '/models';

if (process.env.SERVER === "PROD"){
	mongoose.connect('mongodb://tyrsius:' + process.env.DBPASS + '@localhost/chaoscrusade');
} else
	mongoose.connect('mongodb://serviceUser:prototransgenesis@linus.mongohq.com:10056/chaoscrusade');
//mongoose.connect('mongodb://@localhost/chaoscrusade');
var models = {};

fs.readdirSync(modelsDir).forEach(function(file) {
    require(modelsDir + '/' + file)(mongoose, models);
});

module.exports = models;