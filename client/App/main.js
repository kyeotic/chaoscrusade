require.config({
    paths: {
        'text': 'durandal/amd/text'
    },
    waitSeconds: 30
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'durandal/plugins/router', 

'durandal/messageBox', 'durandal/transitions/entrance'],
function(app, viewLocator, system, router) {
    
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
  
    //This changes Durandal's default promise from jQuery to Q
    system.defer = function (action) {
        var deferred = Q.defer();
        action.call(deferred, deferred);
        var promise = deferred.promise;
        deferred.promise = function () {
            return promise;
        };
        return deferred;
    };
    
    system.delay = function (ms) {
      return Q.delay(ms);
    };
    
    
    app.defer = system.defer;
    app.delay = system.delay;
    app.log = system.log;

    app.title = 'ShiftWise Durandal';
    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //configure routing
        router.useConvention();

        app.adaptToDevice();
        
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});