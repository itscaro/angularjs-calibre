/// <reference path="../../typings/sqlite3/sqlite3.d.ts" />
/// <reference path="../../typings/sequelize/sequelize.d.ts" />
import sqlite3 = require('sqlite3');
import Sequelize = require('sequelize');

module CalibreDatabase {

    export class DB {
        private db;
        Book;
        Author;
        BookAuthor;
        Rating;
        BookRating;
        Language;
        BookLanguage;
        Tag;
        BookTag;
        Data;
        constructor(dsn: string) {
            this.db = new Sequelize('', '', '', {
                //logging: false,
                dialect: 'sqlite',
                // SQLite only
                storage: dsn
            });
        }

        init() {
            this.Book = this.db.define('book',
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
                        coverUrl: function() {
                            if (this.has_cover) {
                                return '/api/books/' + this.id + '/cover.jpg'
                            } else {
                                return null;
                            }
                        }
                    },
                    setterMethods: {
                    }
                }
            );

            this.Author = this.db.define(
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

            this.BookAuthor = this.db.define(
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

            this.Rating = this.db.define(
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

            this.BookRating = this.db.define(
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

            this.Language = this.db.define(
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

            this.BookLanguage = this.db.define(
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

            this.Tag = this.db.define(
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

            this.BookTag = this.db.define(
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

            this.Data = this.db.define(
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

            this.Book.belongsToMany(this.Author, { through: this.BookAuthor, foreignKey: 'book' });
            this.Author.belongsToMany(this.Book, { through: this.BookAuthor, foreignKey: 'author' });

            this.Book.belongsToMany(this.Rating, { through: this.BookRating, foreignKey: 'book' });
            this.Rating.belongsToMany(this.Book, { through: this.BookRating, foreignKey: 'rating' });

            this.Book.belongsToMany(this.Language, { through: this.BookLanguage, foreignKey: 'book' });
            this.Language.belongsToMany(this.Book, { through: this.BookLanguage, foreignKey: 'lang_code' });

            this.Book.belongsToMany(this.Tag, { through: this.BookTag, foreignKey: 'book' });
            this.Tag.belongsToMany(this.Book, { through: this.BookTag, foreignKey: 'tag' });

            this.Book.hasMany(this.Data, { foreignKey: 'book' });
        }
    }


}
export = CalibreDatabase