/*
const WebSocket = require('ws');

const ws = new WebSocket('wss://my.webhookrelay.com/v1/socket');

var apiKey = process.env.RELAY_KEY;
var apiSecret = process.env.RELAY_SECRET;

ws.on('open', function open() {
    // on connection, send our authentication request
    ws.send(JSON.stringify({ action: 'auth', key: apiKey, secret: apiSecret }));
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function incoming(data) {
    console.log(data)
    webhook(data)
    var msg = JSON.parse(data);
    if (msg.type === 'status' && msg.status === 'authenticated') {
        // if we got authentication confirmation, send subscribe event to the server
        ws.send(JSON.stringify({ action: 'subscribe', buckets: ['123'] }));
    }
});

function webhook(data) {
    //  var data;

    if (request.method === "POST") {
        if (request.headers["Authorization"] === "YZB") {
            data = request.json;
            console.log(data);
            return "ok";
        } else {
            return "Auth 認證失敗";
        }
    }
}
*/
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 3000;

app.use(bodyParser.json());

app.post('/', function(req, res) {
    var body = req.body;
    var trackingNumber = body.msg.tracking_number;
    var slug = body.msg.slug;
    var token = body.msg.unique_token;

    console.log(trackingNumber, slug, token);

    res.json({
        message: '成功取得',
    });
});


var server = app.listen(port, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log(`監聽 http://${host + port} 的示例應用`);

});
