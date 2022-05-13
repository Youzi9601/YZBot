
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

