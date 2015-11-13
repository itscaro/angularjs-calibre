var http = require('http');
var express = require('express');
var querystring = require('querystring');
var fs = require('fs');
var lwip = require('lwip');
var Sequelize = require('sequelize');
var Promise = require("bluebird");
require('sqlite3')

var Config = require('./config');
var db = require(__dirname + '/database.js')(Config.calibre.path + '/metadata.db');
var app = express();

// Add Access-Control headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Static servings
app.use(express.static(__dirname + '/../app'));

// Config
app.get('/config.js', function (req, res) {
    var config = require('util')._extend({}, Config);
    delete (config.calibre)
    res.send("var Config = " + JSON.stringify(config))
});

// API
app.get(
    [
        "/api/books/:id([0-9]+)/download/:format([a-z0-9]+)",
        "/api/books/:id([0-9]+)/download/:format([a-z0-9]+).([a-z0-9]+)"
    ], function (req, res) {
        console.log(req.params, req.query);

        var format = req.params.format ? req.params.format : null,
            file;

        db.Book.findById(req.params.id).then(function (book) {
            book.getData({
                where: {
                    format: format
                }
            }).then(function (data) {
                data.forEach(function (_data) {
                    book.data = _data;
                    file = {
                        name: _data.name + '.' + _data.format.toLowerCase(),
                        path: Config.calibre.path + '/' + book.path + '/' + _data.name + '.' + _data.format.toLowerCase()
                    };
                    console.log('Sending: ', JSON.stringify(file));
                    res.download(file.path, file.name);
                });
            });
        });
    }
);

app.get(
    "/api/books/:id([0-9]+)/cover.jpg",
    function (req, res) {
        console.log(req.params, req.query);
        var newHeight = req.query.height ? req.query.height : 100;

        db.Book.findById(req.params.id).then(function (book) {
            var cover = {
                original: Config.calibre.path + '/' + book.path + '/cover.jpg',
                cached: 'cache/' + book.id + '-' + newHeight + '.jpg'
            };

            try {
                fs.accessSync('cache', fs.R_OK | fs.W_OK)
            }
            catch (e) {
                fs.mkdirSync('cache');
            }

            res.setHeader("Cache-Control", "public, max-age=" + 30 * 86400);
            res.setHeader("Expires", new Date(Date.now() + (30 * 86400 * 1000)).toUTCString());
            fs.stat(cover.cached, function (err, stats) {
                if (err || !stats.isFile()) {
                    console.log('Generating cache file for: ', JSON.stringify(cover));

                    lwip.open(cover.original, function (err, image) {
                        var ratio = image.height() / newHeight,
                            newWidth = Math.round(image.width() / ratio);

                        console.log('Image size - New image size', image.width(), image.height(), newWidth, newHeight);

                        image.batch()
                            .scale(1 / Math.round(ratio, 1))
                            .writeFile(cover.cached, function (err, buffer) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Sending cache file: ', cover.cached);

                                    // Send newly generated cache file
                                    res.download(cover.cached)
                                }
                            })
                    });
                } else {
                    console.log('Sending cache file: ', cover.cached);

                    // Send cache file
                    res.download(cover.cached)
                }
            });
        });
    }
);

app.get(
    [
        "/api/books/",
        "/api/books/page/:page([0-9]+)",
        "/api/books/page/:page([0-9]+)/:limit([0-9]+)"
    ], function (req, res) {
        var page = req.params.page > 1 ? req.params.page : 1,
            limit = req.params.limit ? req.params.limit : 10,
            sqlWhere, sqlOrder;

        if (req.query.title) {
            sqlWhere = {
                title: {
                    $like: '%' + req.query.title + '%'
                }
            }
        }

        if (req.query.order) {
            sqlOrder = req.query.order
        } else {
            sqlOrder = 'DESC'
        }

        if (req.query.title) {
            sqlWhere = {
                title: {
                    $like: '%' + req.query.title + '%'
                }
            }
        }

        if (req.query.order) {
            sqlOrder = req.query.order
        } else {
            sqlOrder = 'DESC'
        }

        var count = 0;
        db.Book.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: sqlWhere,
            include: [db.Author, db.Rating, db.Language, db.Data, db.Tag]
        }).then(function (books) {
            count = books.count;
            return Promise.all(books.rows.map(function (book) {
                if (book.has_cover) {
                    book.coverUrl = 'api/book/' + book.id + '/cover.jpg';
                } else {
                    book.coverUrl = null;
                }

                return book;
            }));
        }).spread(function () {
            res.json({
                books: [].slice.apply(arguments),
                count: count
            });
        });
    });

app.get(
    "/api/books/:id([0-9]+)",
    function (req, res) {
        db.Book.findById(req.params.id, {
            include: [db.Author, db.Rating, db.Language, db.Data, db.Tag]
        }).then(function (book) {
            res.json(book)
            //var path = Config.calibre.path + '/' + book.path + '/' + book.data[0].name + '.epub'
            //if (fs.existsSync(path)) {
            //    var EPub = require("epub");
            //    var epub = new EPub(path);
            //    epub.on("end", function () {
            //        console.log(epub.metadata)
            //        book.metadata = epub.metadata
            //
            //        res.json(book)
            //    });
            //    try {
            //        epub.parse();
            //    } catch (e) {
            //
            //    } finally {
            //
            //    }
            //}
        });
    });

app.set('host', process.env.host || (Config.server && Config.server.host) || '127.0.0.1')
app.set('port', process.env.port || (Config.server && Config.server.port) || 0)
app.set('x-powered-by', false)

var server = http.createServer(app).listen(app.get('port'), app.get('host'), function () {
    app.set('host', server.address().address)
    app.set('port', server.address().port)

    Config.server = {
        host: app.get('host'),
        port: app.get('port')
    }

    console.log('Express server listening on ', app.get('host'), app.get('port'))
});

try {
// Reply config to view through IPC, because port can be random
    var ipc = require('ipc');
    ipc.on('config', function (event, arg) {
        event.returnValue = Config;
    });
} catch (e) {

}

module.exports = app
