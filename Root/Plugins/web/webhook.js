const Config = require('../../../Config');
const { log } = require('./../../Utils/log');
module.exports =
    /**
     * @param {import('discord.js').Client} client
     */
    (client) => {

        const Config = require('../../../Config');

        var http = require('http'),
            https = require('https'),
            express = require('express'),
            app = express();

        app.use(express.json({ verify: (req, res, buffer) => { req.rawBody = buffer; } }));

        app.post('/webhook', function (req, res) {
            return new Promise((resolve) => {
                if (Config.webhook.authorization &&
                    req.headers.authorization !== Config.webhook.authorization)
                    return res.status(403).json({ error: '沒有認證' });
                else {
                    res.status(200).send('成功！');
                    vote(req.body, client);
                }
            });
        }); // 附加中間件

        const port = Number(Config.webhook.port);
        // app.listen(port) //你的港口
        http.createServer(app).listen(port);
        console.log(` -> Webhook 接收於 Port:${port}`);

    };

/**
{
  id: '859283530403282984', // 機器人/伺服器 ID
  user: { // 投票者的資訊
    id: '856918496893599805',
    name: 'Youzi',
    avatar: '89d9fe477d93364a8d8a7ad3e88fba0b',
    discriminator: '0753'
  },
  type: 'test' // 'test': '測試', 'upvote': '投票',
}
 */

/**
 * @param {String} body
 * @param {import('discord.js').Client} client
 */
function vote(body, client) {
    const type = body.type;
    if (type == 'test') {
        log('info', `[測試]投票 > ${body.user.name + '#' + body.user.discriminator}`, true, client, {
            content: '新的投票！',
            embeds: [
                {
                    description: `<@${body.user.id}> 為 <@${body.id}> 測試了投票！`,
                    color: 0x808080,
                    footer: {
                        text: `${body.user.name + '#' + body.user.discriminator}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${body.user.id}/${body.user.avatar}`,
                    },
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${body.user.id}/${body.user.avatar}`,
                    },
                },
            ],
        },
            Config.webhook.channel);
    } else if (type == 'upvote') {
        log('info', `有人投票了！> ${body.user.name + '#' + body.user.discriminator}`, true, client, {
            content: '新的投票！',
            embeds: [
                {
                    description: `<@${body.user.id}> 為 <@${body.id}> 投票了！`,
                    color: 0x808080,
                    footer: {
                        text: `${body.user.name + '#' + body.user.discriminator}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${body.user.id}/${body.user.avatar}`,
                    },
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${body.user.id}/${body.user.avatar}`,
                    },
                },
            ],
        },
            Config.webhook.channel);
    }

}