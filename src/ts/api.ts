import CalibreDatabase = require('./calibre-database');
import fs = require('fs');

module Api {
    export class Api {

        private config;
        private db

        constructor(config) {
            this.config = config
            this.db = new CalibreDatabase.DB(this.config.calibre.path);
        }

        getBookById(req, res) {
            this.db.Book.findById(req.params.id, {
                include: [this.db.Author, this.db.Rating, this.db.Language, this.db.Data, this.db.Tag]
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
        }

        coverUrl(req, res) {
            console.log(req.params, req.query);
            var newHeight = req.query.height ? req.query.height : 100;

            this.db.Book.findById(req.params.id).then(function (book) {
                var cover = {
                    original: this.config.calibre.path + '/' + book.path + '/cover.jpg',
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

                        /*
                         lwip.open(cover.original, function(err, image) {
                         var ratio = image.height() / newHeight,
                         newWidth = Math.round(image.width() / ratio);

                         console.log('Image size - New image size', image.width(), image.height(), newWidth, newHeight);

                         image.batch()
                         .scale(1 / Math.round(ratio))
                         .writeFile(cover.cached, function(err, buffer) {
                         if (err) {
                         console.log(err);
                         } else {
                         console.log('Sending cache file: ', cover.cached);

                         // Send newly generated cache file
                         res.download(cover.cached)
                         }
                         })
                         });
                         */
                        res.download(cover.original)
                    } else {
                        console.log('Sending cache file: ', cover.cached);

                        // Send cache file
                        res.download(cover.cached)
                    }
                });
            });
        }

        downloadBookById(req, res) {
            console.log(req.params, req.query);

            var format = req.params.format ? req.params.format : null,
                file;

            this.db.Book.findById(req.params.id).then(function (book) {
                book.getData({
                    where: {
                        format: format
                    }
                }).then(function (data) {
                    data.forEach(function (_data) {
                        book.data = _data;
                        file = {
                            name: _data.name + '.' + _data.format.toLowerCase(),
                            path: this.config.calibre.path + '/' + book.path + '/' + _data.name + '.' + _data.format.toLowerCase()
                        };
                        console.log('Sending: ', JSON.stringify(file));
                        res.download(file.path, file.name);
                    });
                });
            });
        }

        getBooks(req, res) {
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
            this.db.Book.findAndCountAll({
                offset: (page - 1) * limit,
                limit: limit,
                where: sqlWhere,
                include: [this.db.Author, this.db.Rating, this.db.Language, this.db.Data, this.db.Tag]
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
        }
    }
}

export = Api