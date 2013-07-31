define(['durandal/app', 'knockout'], function(app, ko) {
    var User = function(init) {
        var self = this;
        self.id = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.username = ko.observable();
        self.password = ko.observable();
        self.role = ko.observable();
        
        self.update = function(data) {
            data = data || {};
            self.id(data.id || self.id() || "");
            self.firstName(data.firstName || self.firstName() || "");
            self.lastName(data.lastName || self.lastName() || "");
            self.username(data.username || self.username() || "" );
            self.password(data.password || self.password() || "" );
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