//Fix jsLINT
var ko = ko || {};

define(['durandal/app'],
function(app) {
    var User = function(init) {
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.username = ko.observable();
        self.password = ko.observable();
        self.primaryHdoId = ko.observable();
        self.primaryMsvId = ko.observable();
        self.role = ko.observable();
        
        self.update = function(data) {
            data = data || {};
            self.id(data.id || self.id() || "");
            self.name(data.name || self.name() || "" );
            self.username(data.username || self.username() || "" );
            self.password(data.password || self.password() || "" );
            self.primaryHdoId(data.primaryHdoId || self.primaryHdoId() || "" );
            self.primaryMsvId(data.primaryMsvId || self.primaryMsvId() || "" );
            self.role(data.role || self.role() || "" );
        };
        self.update(init);
        
        self.isNew = ko.computed(function() {
            return self.id().length === 0;
        });
    };
    
    User.prototype.canDeactivate = function () {
        return app.showMessage('Are you sure you want to cancel?', 'Just Checking...', ['Yes', 'No']);
    };
    
    User.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        
        if(!this.keepPassword)
            delete copy.password;
        return copy;
    };
    
    return User;
});