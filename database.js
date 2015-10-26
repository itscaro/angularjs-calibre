module.exports = function (dsn) {
    console.log(dsn);
    var module = {};

    var Sequelize = require('sequelize');

    sequelize = new Sequelize('', '', '', {
        dialect: 'sqlite',
        // SQLite only
        storage: dsn
    });

    module.db = sequelize;

    var Book = sequelize.define(
        'book',
        {
            uuid: {
                type: Sequelize.STRING
            },
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            title: Sequelize.STRING,
            has_cover: Sequelize.BOOLEAN,
            path: Sequelize.STRING
        },
        {
            timestamps: false,
            getterMethods: {
                rating: function() {
                    return this._rating
                },
                authors: function () {
                    return this._authors
                },
                coverUrl: function () {
                    if (this.has_cover) {
                        return '/api/books/' + this.id + '/cover.jpg'
                    } else {
                        return null;
                    }
                }
            },
            setterMethods: {
                rating: function(value) {
                    this._rating = value;
                    return this._rating
                },
                authors: function (value) {
                    if (typeof this._authors == 'undefined') {
                        this._authors = []
                    }
                    this._authors.push(value);
                    return this._authors
                }
            }
        }
    );

    var Author = sequelize.define(
        'author',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: Sequelize.STRING,
            link: Sequelize.STRING
        },
        {
            timestamps: false
        }
    );

    var BookAuthor = sequelize.define(
        'books_authors_link',
        {
            book: Sequelize.INTEGER,
            author: Sequelize.INTEGER
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    var Rating = sequelize.define(
        'rating',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            rating: Sequelize.INTEGER
        },
        {
            timestamps: false
        }
    );

    var BookRating = sequelize.define(
        'books_ratings_link',
        {
            book: Sequelize.INTEGER,
            rating: Sequelize.INTEGER
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    Book.belongsToMany(Author, {through: BookAuthor, foreignKey: 'book'});
    Author.belongsToMany(Book, {through: BookAuthor, foreignKey: 'author'});

    Book.belongsToMany(Rating, {through: BookRating, foreignKey: 'book'});
    Rating.belongsToMany(Book, {through: BookRating, foreignKey: 'rating'});


    module.Book = Book;
    module.Author = Author;
    module.Rating = Rating;
    return module;
};
