module.exports = function (dsn) {
    var module = {};

    var Sequelize = require('sequelize');

    sequelize = new Sequelize('', '', '', {
        //logging: false,
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
                rating: function () {
                    return this._rating
                },
                authors: function () {
                    return this._authors
                },
                data: function () {
                    return this._data
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
                rating: function (value) {
                    this._rating = value;
                },
                data: function (value) {
                    if (typeof this._data == 'undefined') {
                        this._data = []
                    }
                    this._data.push(value);
                },
                authors: function (value) {
                    if (typeof this._authors == 'undefined') {
                        this._authors = []
                    }
                    this._authors.push(value);
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

    var Language = sequelize.define(
        'language',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            lang_code: Sequelize.STRING
        },
        {
            timestamps: false
        }
    );

    var BookLanguage = sequelize.define(
        'books_languages_link',
        {
            book: Sequelize.INTEGER,
            lang_code: Sequelize.INTEGER
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    var Tag = sequelize.define(
        'tags',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: Sequelize.STRING
        },
        {
            timestamps: false
        }
    );

    var BookTag = sequelize.define(
        'books_tags_link',
        {
            book: Sequelize.INTEGER,
            tag: Sequelize.INTEGER
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    var Data = sequelize.define(
        'data',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            book: Sequelize.INTEGER,
            format: Sequelize.STRING,
            name: Sequelize.STRING,
            uncompressed_size: Sequelize.INTEGER
        },
        {
            timestamps: false
        }
    );

    Book.belongsToMany(Author, {through: BookAuthor, foreignKey: 'book'});
    Author.belongsToMany(Book, {through: BookAuthor, foreignKey: 'author'});

    Book.belongsToMany(Rating, {through: BookRating, foreignKey: 'book'});
    Rating.belongsToMany(Book, {through: BookRating, foreignKey: 'rating'});

    Book.belongsToMany(Language, {through: BookLanguage, foreignKey: 'book'});
    Language.belongsToMany(Book, {through: BookLanguage, foreignKey: 'lang_code'});

    Book.belongsToMany(Tag, {through: BookLanguage, foreignKey: 'book'});
    Tag.belongsToMany(Book, {through: BookLanguage, foreignKey: 'lang_code'});

    Book.hasMany(Data, {foreignKey: 'book'});

    module.Book = Book;
    module.Author = Author;
    module.Rating = Rating;
    return module;
};
