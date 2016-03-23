import * as express from 'express'
import * as pouchdb from 'pouchdb'
import * as fs from 'fs'
import * as morgan from 'morgan'
import * as multer from 'multer'
import * as epubParser from 'epub-parser'

let app = express();
let upload = multer({ dest:  __dirname + "/../books/tmp" })

app.use(morgan('dev'))
app.use(express.static(__dirname+'/../'));

app.get('/books', function(req, res){
    fs.readdir(__dirname + "/../books/", function(err, files) {
        console.log(files)
        let _files = []
        files.forEach(function(e, i) {
            console.log(i, e)
            if (e.match(/.*\.(mobi|epub)$/)) {
                _files.push(e)
            }
        })

        res.status(200).type('application/json').end(JSON.stringify(_files))
    })
})

app.post('/upload', upload.single('file'), function (req, res) {
    console.log('/upload', req.file)

    fs.rename(req.file.path, __dirname + "/../books/" + req.file.originalname, function(err, data) {
         epubParser.open(__dirname + "/../books/" + req.file.originalname, function (err, epubData) {
            if(err) {
                console.log(err)
            } else {
                console.log(epubData.easy.simpleMeta)
            }
         })

        switch(req.accepts(['html', 'json'])) {
            default:
            case 'html':
                res.redirect("back")
                break
            case 'json':
                res.status(200).type('application/json').end({ status: 'OK' })
                break
        }

    })
})

app.listen(3050)
