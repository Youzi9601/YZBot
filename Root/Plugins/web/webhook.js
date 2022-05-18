module.exports = (client) => {

    const Topgg = require('@top-gg/sdk')
    const Config = require('../../../Config')

    var http = require('http'),
        https = require('https'),
        express = require('express'),
        app = express();

    const webhook = new Topgg.Webhook(Config.webhook.authorization)
    // 添加您的 Top.gg webhook 授權（不是機器人令牌）

    app.post('/webhook', async (request) => {
        // 拿到 Webhook 的 JSON 格式資料 
        console.log(request)
        return response({ status: 200 });
    }); //附加中間件
    const port = Number(Config.webhook.port)
    // app.listen(port) //你的港口
    http.createServer(app).listen(port);
    console.log(` -> Webhook 接收於 Port:${port}`)

}

function response({ data = "", status = 200, headers = {} }) {
    let hander = new Headers()
    return new Response(data, {
        status,
        headers: header,
    });
}
