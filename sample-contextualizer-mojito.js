/*jslint node:true, nomen: true*/

'use strict';

var mojito = require('mojito-server'),
    app = mojito();

// mojitizing extensions so they can be available thru mojito.*
mojito.plug(require('mojito-contextualizer'));

mojito.contextualizer({
    more: 'configs here',
    dimensions: {
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

// registering a fake `dispatch engine`.
mojito.dispatcher('mojito', {
    dispatch: function (name, options, page, callback) {
        callback(null, JSON.stringify({
            name: name,
            options: options,
            page: page
        }));
    }
});

app.get('*', mojito.dispatch('index', {
    json: true
}));

// listening
app.listen(app.get('port'), function () {
    console.log("Server listening on port " +
        app.get('port') + " in " + app.get('env') + " mode");
});