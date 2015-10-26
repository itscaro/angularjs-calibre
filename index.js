var express = require('express');
var httpProxy = require('http-proxy');
var querystring = require('querystring');
var Sequelize = require('sequelize');
var lwip = require('lwip');

var Config = {
    calibre: {
        path: '/home/itscaro/Library'
    }
};
var db = require('./database.js')(Config.calibre.path + '/metadata.db');

var apiForwardingUrl = 'http://book.itscaro.me/';

var server = express();
server.set('port', 8099);
server.use(express.static(__dirname + '/app'));

var apiProxy = httpProxy.createProxyServer();

server.all("/api/cops/:path", function (req, res) {
    var urlToCall = apiForwardingUrl + req.params.path + '?' + querystring.stringify(req.query)
    console.log('Forwarding API requests to ' + urlToCall);

    apiProxy.web(req, res, {
        target: urlToCall,
        ignorePath: true,
        prependPath: true
    });
});

server.get(
    "/api/books/:id([0-9]+)/cover.jpg",
    function (req, res) {
        console.log(req.params, req.query);

        var promise = db.Book.findById(req.params.id);
        promise.then(function (book) {
            console.log('Sending: ' + Config.calibre.path + '/' + book.path + '/cover.jpg');

            lwip.open(Config.calibre.path + '/' + book.path + '/cover.jpg', function (err, image) {
                console.log('Image size', image.width(), image.height());

                var newHeight = req.query.height ? req.query.height : 100,
                    ratio = image.height() / newHeight,
                    newWidth = Math.round(image.width() / ratio);

                console.log('New image size', newWidth, newHeight);
                console.log('New image ratio', 1 / Math.round(ratio));

                // check err...
                // manipulate image:
                image.batch()
                    .scale(1 / Math.round(ratio, 1))
                    .toBuffer('jpg', function (err, buffer) {
                        // check err...
                        // save buffer to disk / send over network / etc.
                        res.send(buffer)
                    });
            });
            //res.download(Config.calibre.path + '/' + book.path + '/' + 'cover.jpg', '3-cover.jpg');
        });
    }
);

server.get([
    "/api/books/",
    "/api/books/:offset([0-9]+)",
    "/api/books/:offset([0-9]+)/:limit([0-9]+)"
], function (req, res) {
    var books = db.Book.findAll({
        offset: req.params.offset ? req.params.offset : 0,
        limit: req.params.limit ? req.params.limit : 10
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
                book.coverUrl = '/api/book/' + book.id + '/cover.jpg';
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
    "/api/books/:id",
    function (req, res) {
        var promise = db.Book.findById(req.params.id);
        promise.then(function (book) {
            var promises = []
            var promise = book.getAuthors();
            promises.push(promise);
            promise.then(function (authors) {
                authors.forEach(function (author) {
                    book.authors = author.name
                })
            });

            Promise.all(promises).then(function () {
                res.json(book);
            })
        });
    }
);


server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});
