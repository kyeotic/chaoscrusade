require.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout-2.3.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery-1.9.1'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    },
    waitSeconds: 30
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'data/socketBind'],
function(system, app, viewLocator) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");  

    //specify which plugins to install and their configuration
    app.configurePlugins({

        //Durandal plugins
        router:true,
        dialog: true,
        widget: {
            kinds: ['authInput']
        },

        //App plugins
        knockoutExtensions: true,
        knockoutCommands: true,
        qPatch: {
            debugMode: false
        }
    });

    app.title = 'Chaos Crusade';
    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        //viewLocator.useConvention();
        
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('shell/shell');
    });
});