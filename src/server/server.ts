import http = require('http');
import express = require('express');
import querystring = require('querystring');
import fs = require('fs');
import Promise = require('bluebird');
import ApiModule = require('./api');

var Config = JSON.parse(fs.readFileSync(__dirname + '/../config.json').toString());
var Api = new ApiModule.Api(Config);

var app = express();

app.set('host', process.env.HOST || (Config.server && Config.server.host) || '127.0.0.1');
app.set('port', process.env.PORT || (Config.server && Config.server.port) || 0);
app.set('x-powered-by', false);

// Add Access-Control headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Static servings
app.use(express.static(__dirname + '/../app'));

// API
app.get("/api/books/:id([0-9]+)/download/:format([a-z0-9]+)", Api.downloadBookById);
app.get("/api/books/:id([0-9]+)/download/:format([a-z0-9]+).([a-z0-9]+)", Api.downloadBookById);
app.get("/api/books/", Api.getBooks);
app.get("/api/books/page/:page([0-9]+)", Api.getBooks);
app.get("/api/books/page/:page([0-9]+)/:limit([0-9]+)", Api.getBooks);
app.get("/api/books/:id([0-9]+)", Api.getBookById);
app.get("/api/books/:id([0-9]+)/cover.jpg", Api.coverUrl);
app.get("/config.js", function (req, res) {
    res.send("var Config = " + JSON.stringify({
            server: Config.server
        })
    )
});

// Create server
var server = http.createServer(app).listen(app.get('port'), app.get('host'), function () {
    app.set('host', server.address().address);
    app.set('port', server.address().port);
    Config.server = {
        host: app.get('host'),
        port: app.get('port')
    };

    console.log('Express server listening on ', app.get('host'), app.get('port'))
});

// Electron app
try {
    // Reply config to view through IPC, because port can be random
    require('electron').on('config', function (event, arg) {
        event.returnValue = Config;
    });
} catch (e) {
    console.warn("No module electron")
}
