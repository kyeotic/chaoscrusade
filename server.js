var fs = require('fs'),
    port = process.env.PORT || 3000;

require('sugar');
var express = require("express");
var app = express();
app.fs = fs;

var dir = __dirname + '/client/';

//Configure
app.configure(function() {
    app.use(require("./app_modules/security/allowCors"));
    
    app.set('views', dir + 'views/');
    app.engine('.html', require("./app_modules/htmlEngine.js"));
    app.set('view engine', 'html');
    
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express['static'](dir + 'assets/'));
    app.use(app.router); 
});

//Security
app.hasher = require("./app_modules/security/hasher");
app.tokenAuth = require("./app_modules/security/authToken");
app.rolesAuth = require("./app_modules/security/authRoles");

//Database
app.db = require('./app_modules/db');
//console.log(app.db);

// Routes
require('./routes')(app);

//Start Listening
app.listen(port);