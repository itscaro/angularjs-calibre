var express = require('express');
var httpProxy = require('http-proxy');
var querystring = require('querystring');

var apiForwardingUrl = 'http://book.itscaro.me/';

var server = express();
server.set('port', 3000);
server.use(express.static(__dirname + '/app'));

var apiProxy = httpProxy.createProxyServer();

server.all("/api/cops/:path", function(req, res) {
    var urlToCall = apiForwardingUrl + req.params.path + '?' + querystring.stringify(req.query)
    console.log('Forwarding API requests to ' + urlToCall);

    apiProxy.web(req, res, {
        target: urlToCall,
        ignorePath: true,
        prependPath: true
    });
});

server.listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
});
