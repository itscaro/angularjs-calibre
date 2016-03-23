var dragDrop = require('drag-drop')
window.$ = require('jquery')
var bluebird = require('bluebird')
window.JSZip = require('jszip')

$(function() {
    dragDrop('html', function (files, pos) {
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
            success: function(data){
                console.info(data)
            },
            error: function(err) {
                console.error(data)
            }
        });

    })

    var Book

    $.get('/books', function(data){
        $(data).each(function(i, e){
            $('#books')
                .append($("<option></option>")
                .attr("value",e)
                .text(e));
        })
    })

    $('#books').on('change', function(e){
        $('#area').html('')
        $('#toc').html('')

        var selectedBook = $('option:selected', this).text()
        if (selectedBook == '--') {
            return
        }

          Book = ePub("books/" +  selectedBook);
          Book.getMetadata().then(function(meta){
                document.title = meta.bookTitle + " – " + meta.creator;
          });
          Book.getToc().then(createOptions);

        Book.renderTo("area");


        function createOptions(node, level, optgroup){
                if (level === undefined) {
                    var level = 0
                }

              var toc = $('#toc')
             node.forEach(function(chapter) {
                console.debug(chapter)

              if (level == 0) {
                  optgroup = $('<optgroup label="'+chapter.label+'"></optgroup>')
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
                    createOptions(chapter.subitems, level+1, optgroup)
                }
              });

              toc.on('change', function(){
                  Book.goto($('option:selected', this).value());
                  return false;
              })

            }
    })
})
