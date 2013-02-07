/*jslint node:true, nomen: true*/

'use strict';

var mojito = require('mojito-server'),
    app = mojito();

// mojitizing extensions so they can be available thru mojito.*
mojito.plug(require('mojito-yui'));

app.configure('development', function () {
    mojito.yui({
        combine: false,
        debug: true,
        filter: "debug"
    });
    // you can also use a custom version of YUI by
    // specifying a custom path as a second argument,
    // or by installing yui at th app level using npm:
    // mojito.yui({
    //     combine: false,
    //     debug: true,
    //     filter: "debug"
    // }, __dirname + '/node_modules/yui/');

    // serving YUI from local server
    app.use(mojito.yui.local({
        // overruling any default config provided by mojito.yui.cdn()
        // routine by passing a new value. E.g:
        // comboSep: '~'
    }));
});

app.configure('production', function () {
    mojito.yui({
        combine: true,
        debug: false,
        filter: "min"
    });

    // serving YUI from CDN directly
    app.use(mojito.yui.cdn());
});

// registering a fake `dispatch engine`.
mojito.dispatcher('mojito', {
    dispatch: function (name, options, runtime, callback) {
        callback(null, JSON.stringify({
            name: name,
            options: options,
            runtime: runtime
        }));
    }
});

// forcing YUI to run in debug mode for specific path
app.get('/debug', mojito.yui.debug());

// printing runtime information
app.get('*', mojito.dispatch('index', {
    json: true
}));

// listening
app.listen(app.get('port'), function () {
    console.log("Server listening on port " +
        app.get('port') + " in " + app.get('env') + " mode");
});