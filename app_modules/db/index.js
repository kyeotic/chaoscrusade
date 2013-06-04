var mongoose = require('mongoose');
mongoose.connect('mongodb://serviceUser:prototransgenesis@linus.mongohq.com:10056/chaoscrusade');

var models = {};

//Setup Schema
require('./models/users')(mongoose, models);

module.exports = models;