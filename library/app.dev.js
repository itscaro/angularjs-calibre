var dragDrop = require('drag-drop')
window.$ = require('jquery')
var bluebird = require('bluebird')
window.JSZip = require('jszip')

$(function() {
    var App = this
    App.Book = ePub({ restore: true })

    var currentReading = getFromStorage('currentReading')
    if (currentReading !== null && currentReading.book !== undefined) {
        showBook(currentReading.book, currentReading.locationCfi)
    }

    function getFromStorage(key) {
        if (typeof (Storage) !== undefined && localStorage.getItem(key) !== null) {
            return JSON.parse(localStorage.getItem(key))
        }

        return null
    }

    function saveToStorage(key, value) {
        if (typeof (Storage) !== undefined && value != undefined) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        return false
    }

    function showBook(selectedBook, locationCfi) {
        console.group('showBook')
        console.debug(selectedBook, locationCfi)

        App.Book.open("books/" + selectedBook)
            .then(function() {
                // Change window title
                App.Book.getMetadata()
                    .then(function(meta) {
                        document.title = meta.bookTitle + " – " + meta.creator;
                    });

                // TOC
                App.Book.getToc()
                    .then(createToc);

                // Render
                App.Book.renderTo("area")
                    .then(function(o) {
                        console.debug('Done renderTo', o)

                        // Check if the selectedBook is already in progress
                        if (locationCfi === undefined) {
                            var currentProgress = getFromStorage('currentProgress')
                            if (currentProgress !== null && currentProgress[selectedBook] !== undefined) {
                                locationCfi = currentProgress[selectedBook].locationCfi
                            }
                        }

                        if (locationCfi !== undefined) {
                            console.debug('Goto', locationCfi)
                            App.Book.displayChapter(locationCfi)
                                .then(function(o) {
                                    console.debug('Done displayChapter', o)
                                })
                                .catch(function(e) {
                                    console.error(e)
                                })
                        } else {
                        }
                    })
                    .then(function() {
                        App.Book.on('renderer:locationChanged', function(locationCfi) {
                            console.debug('Current location', locationCfi)
                            saveToStorage('currentReading', {
                                book: selectedBook,
                                locationCfi: locationCfi
                            })

                            var currentProgress = getFromStorage('currentProgress')
                            if (currentProgress === null) {
                                currentProgress = {}
                            }
                            currentProgress[selectedBook] = {
                                locationCfi: locationCfi
                            }
                            saveToStorage('currentProgress', currentProgress)
                        });
                    })
                    .catch(function(e) {
                        console.error(e)
                    })
            })

        console.groupEnd()
    }

    var fnKeyNavigation = function(e) {
        console.group('fnKeyNavigation')
        console.debug('Keycode', e.keyCode)

        if (App.Book !== undefined) {
            if (e.keyCode === 37 || e.keyCode === 38) {
                // left + up
                App.Book.prevPage()
            }
            else if (e.keyCode === 39 || e.keyCode === 40) {
                // right + down
                App.Book.nextPage()
            }
        }
        console.groupEnd()
    }

    EPUBJS.Hooks.register("beforeChapterDisplay").keyNavigation = function(callback, renderer) {
        console.group('Hook: keyNavigation')
        console.debug('Chapter', renderer.currentChapterCfiBase)

        $("html", renderer.render.document).on("keydown", fnKeyNavigation);

        if (callback) callback();
        console.groupEnd()
    }

    $("html").on("keydown", fnKeyNavigation);

    $('#nextPage').on('click', function() {
        if (App.Book === undefined) {
            return
        }
        App.Book.nextPage()
    })
    $('#prevPage').on('click', function() {
        if (App.Book === undefined) {
            return
        }
        App.Book.prevPage()
    })

    dragDrop('html', function(files, pos) {
        console.log('Here are the dropped files', files)
        console.log('Dropped at coordinates', pos.x, pos.y)

        // One file is handled here
        var data = new FormData();
        $.each(files, function(i, file) {
            data.append('file', file);
        });

        $.ajax({
            url: 'upload',
            data: data,
            headers: {
                "Accept": 'application/json'
            },
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data) {
                console.info(data)
                loadBooks()
            },
            error: function(err) {
                console.error(data)
            }
        });

    })

    loadBooks()

    $('#books').on('change', function(e) {
        $('#area').html('')
        $('#toc').html('')

        var selectedBook = $('option:selected', this).text()
        if (selectedBook == '--') {
            return
        }

        showBook(selectedBook)

        $('#toc').on('change', function() {
            var url = $('option:selected', this).attr('value')
            console.debug('Goto ', url)
            App.Book.goto(url);
            return false;
        })

    })

    function createToc(node, level, optgroup) {
        console.group('Creating TOC')
        if (level === undefined) {
            var level = 0
        }

        var toc = $('#toc')
        node.forEach(function(chapter) {
            console.debug(chapter)

            if (level == 0) {
                optgroup = $('<optgroup label="' + chapter.label + '"></optgroup>')
                toc.append(optgroup)
            }

            var prefixLabel = ''
            for (var i = 0; i < level; i++) {
                prefixLabel += '--'
            }
            prefixLabel += ' '

            optgroup.append($("<option></option>")
                .attr("value", chapter.href)
                .text(prefixLabel + chapter.label)
            )

            if (chapter.subitems.length > 0) {
                createToc(chapter.subitems, level + 1, optgroup)
            }
        });
        console.groupEnd()
    }

    function loadBooks() {
        $.get('/books', function(data) {
            $('#books').html('').append($("<option>Please select</option>"))
            $(data).each(function(i, e) {
                $('#books')
                    .append($("<option></option>")
                        .attr("value", e)
                        .text(e))
            })
        })
    }
})
