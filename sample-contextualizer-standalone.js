/*jslint node:true, nomen: true*/

'use strict';

var express        = require('express'),
    contextualizer = require('mojito-contextualizer'),
    app            = express();

contextualizer({
    more: 'configs here',
    dimensions: {
        lang: {
            "en-US": null
        }
    }
});

app.use(contextualizer.lang);

// mojito will use dispatcher config to dispatch "index"
app.get('*', function (req, res, next) {
    res.send({
        server: contextualizer.config(),
        expose: contextualizer.expose(req, res)
    });
});

// listening
app.set('port', process.env.PORT || 8666);
app.listen(app.get('port'), function () {
    console.log("Server listening on port " +
        app.get('port') + " in " + app.get('env') + " mode");
});