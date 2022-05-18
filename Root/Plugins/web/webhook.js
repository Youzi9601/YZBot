module.exports = (client) => {

    const Topgg = require('@top-gg/sdk');
    const Config = require('../../../Config');

    var http = require('http'),
        https = require('https'),
        express = require('express'),
        app = express();

    const webhook = new Topgg.Webhook(Config.webhook.authorization); // 添加您的 Top.gg webhook 授權（不是機器人令牌）

    app.post('/webhook', webhook.listener(vote => {
        // vote 是你的投票對象
        console.log(vote); // 使用者id
        // 以下為執行工作

        // --
    }),
    function(req, res) {
        res.status(200).send('成功！');
    },
    ); // 附加中間件

    const port = Number(Config.webhook.port);
    // app.listen(port) //你的港口
    http.createServer(app).listen(port);
    console.log(` -> Webhook 接收於 Port:${port}`);

};
