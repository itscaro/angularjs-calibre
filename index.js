var express = require('express');
var querystring = require('querystring');
var Sequelize = require('sequelize');
var lwip = require('lwip');
var fs = require('fs');

//process.argv.forEach(function (val, index, array) {
//    console.log(index + ': ' + val);
//});

var Config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var db = require('./database.js')(Config.calibre.path + '/metadata.db');

var server = express();

server.use(express.static(__dirname + '/app'));

server.get(
    [
        "/api/books/:id([0-9]+)/download/:format([a-z0-9]+)",
        "/api/books/:id([0-9]+)/download/:format([a-z0-9]+).([a-z0-9]+)"
    ], function (req, res) {
        console.log(req.params, req.query);

        var format = req.params.format ? req.params.format : null,
            file;

        //var promises = [];
        db.Book.findById(req.params.id).then(function (book) {
            var promise = book.getData({
                where: {
                    format: format
                }
            });
            //promises.push(promise);
            promise.then(function (data) {
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

        //Promise.all(promises).then(function () {
        //});
    }
);

server.get(
    "/api/books/:id([0-9]+)/cover.jpg",
    function (req, res) {
        console.log(req.params, req.query);
        var newHeight = req.query.height ? req.query.height : 100;

        var promise = db.Book.findById(req.params.id);
        promise.then(function (book) {
            var cover = {
                original: Config.calibre.path + '/' + book.path + '/cover.jpg',
                cached: 'cache/' + book.id + '-' + newHeight + '.jpg'
            };

            console.log('Sending: ', JSON.stringify(cover));

            try {
                fs.accessSync('cache', fs.R_OK | fs.W_OK)
            }
            catch (e) {
                fs.mkdirSync('cache');
            }

            res.setHeader("Cache-Control", "public, max-age=" + 30 * 86400);
            res.setHeader("Expires", new Date(Date.now() + (30 * 86400000)).toUTCString());
            if (fs.exists(cover.cached)) {
                res.download(cover.cached)
            } else {
                lwip.open(cover.original, function (err, image) {
                    console.log('Image size', image.width(), image.height());

                    var ratio = image.height() / newHeight,
                        newWidth = Math.round(image.width() / ratio);

                    console.log('New image size', newWidth, newHeight);
                    console.log('New image ratio', 1 / Math.round(ratio));

                    image.batch()
                        .scale(1 / Math.round(ratio, 1))
                        .writeFile(cover.cached, function (err, buffer) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.download(cover.cached)
                            }
                        })
                });
            }
        });
    }
);

server.get(
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

        var books = db.Book.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: sqlWhere,
            order: 'id ' + sqlOrder
        });
        books.then(function (books) {
            var promises = []

            books.forEach(function (book) {
                var promise;
                promise = book.getAuthors();
                promises.push(promise);
                promise.then(function (authors) {
                    authors.forEach(function (author) {
                        book.authors = author.name
                    })
                });

                promise = book.getRatings();
                promises.push(promise);
                promise.then(function (ratings) {
                    ratings.forEach(function (rating) {
                        book.rating = rating.rating
                    })
                });

                if (book.has_cover) {
                    book.coverUrl = 'api/book/' + book.id + '/cover.jpg';
                } else {
                    book.coverUrl = null;
                }
            });

            Promise.all(promises).then(function () {
                res.json(books);
            })
        });
    });

server.get(
    "/api/books/:id([0-9]+)",
    function (req, res) {
        var promise = db.Book.findById(req.params.id);
        promise.then(function (book) {
            var promises = [], promise;
            promise = book.getAuthors();
            promises.push(promise);
            promise.then(function (authors) {
                authors.forEach(function (author) {
                    book.authors = author.name
                })
            });

            promise = book.getData();
            promises.push(promise);
            promise.then(function (data) {
                data.forEach(function (_data) {
                    book.data = _data
                })
            });

            Promise.all(promises).then(function () {
                res.json(book);
            })
        });
    }
);

server.listen(Config.server.port, Config.server.host, function () {
    console.log('Express server listening on ', Config.server.host, Config.server.port);
});
