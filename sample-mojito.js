/*jslint node:true, nomen: true*/

'use strict';

var mojito = require('mojito-server'),
    app = mojito({
        foo: 'mojito'
    });

// mojitizing extensions so they can be available thru mojito.*
// contextualizer plug into mojito
mojito.plug(require('mojito-contextualizer'));

mojito.contextualizer({
    more: 'configs here',
    dimensions: { /* can should be coming from locator */
        lang: {
            "en-US": null
        },
        speed: {
            dialup: null,
            dsl: null
        }
    }
});

// we could drive this by dimensions automatically by using
// `app.use(mojito.contextualizer.all())` which matches contextualizer.* and
// dimensions.*, so by hanging a middleware from contextualizer
// you are automatically enabling a new dimension to be populated;
app.use(mojito.contextualizer.all);
// or manually like this:
// app.use(mojito.contextualizer.lang);
// app.use(mojito.contextualizer.device);




// mojitizing extensions so they can be available thru mojito.*
// yui plug into mojito
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

    // Set a few security-related headers.
    // X-Content-Type-Options=nosniff
    // X-Frame-Options=SAMEORIGIN
    app.use(mojito.lockDownSecurity);
});



// registering a fake `dispatch engine`. Usually, we should do:
// `mojito.dispatcher('<dispatcher-name>', require('<dispatcher-name>'))`
// and if we have multiple dispatch engines attached, we can select the
// default one by doing: `app.set('dispatch engine', '<dispatcher-name>')`
mojito.dispatcher('mojito', {
    dispatch: function (name, options, page, callback) {
        callback(null, JSON.stringify({
            name: name,
            options: options,
            page: page
        }));
    }
});




// these are all the routes that our client side will be able to
// dispatch without a fullpage refresh, `mojito.dispatch()` is
// required. The grouping helps with apps with different pages
// where each page represents an app in the client side.

// mojito will use dispatcher config to dispatch "index"
app.get('/', mojito.dispatch('index'));

// forcing to print on json format
app.get('/photo', mojito.dispatch('photo', {
    json: true
}));

// you can have route specific middleware that will expose data
// into the page object as well.
app.get('/photos', mojito.data('place'), mojito.dispatch('photos'));




// Error handlers
app.use(mojito.notFound);
app.configure('production', function () {
    app.use(mojito.internalServerError);
});




// listening
app.listen(app.get('port'), function () {
    console.log("Server listening on port " +
        app.get('port') + " in " + app.get('env') + " mode");
});