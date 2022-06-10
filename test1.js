run()
async function run() {
    console.log('加載相關啟動文件！')

    /**
     * 設定變數
     */
    const botToken = "";
    const channelId = "";
    const server = { port: 3000, path: './SendToMinecraft' }


    // 
    const fastify = require('fastify')()
    const axios = require('axios').default
    // 基本機器人登入
    const Discord = require('discord.js')
    const client = new Discord.Client({
        intents: [
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS',
            'DIRECT_MESSAGE_TYPING',
            'GUILDS',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_MEMBERS',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MESSAGE_TYPING',
            'GUILD_PRESENCES',
            'GUILD_WEBHOOKS',
        ],
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
        // ws可用於讓機器人上線狀態為使用"手機"
        // ws: { properties: { $browser: 'Discord iOS' } },
    });



    // 登入
    await client.login(botToken);
    console.log('使用 ' + client.user.tag + '登入！')

    // 導出client
    exports.client = client;
    // 這是設定狀態
    client.user.setPresence({
        activities: [
            {
                name: `123456`,
                // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
            },
        ],
        // 如果ws有取消註解，則下面這行可以使用！
        // browser: 'DISCORD IOS',
        status: 'dnd', // 請勿打擾
    });


    /**
     * Ws Server 創建
     */
    const { WebSocketServer } = require('ws')
    const wss = new WebSocketServer({ server });
    // 連線
    wss.on('connection', function connection(ws) {

        // 訊息事件
        ws.on('message', function message(data) {
            console.log('已收到: %s', data);
        });

        // client 事件
        client.on('messageCreate', (message) => {
            if (message.channel.id != channelId) return; // 如果非監測頻道
            if (message.author.bot) return; // 如果為機器人則返回
            if (message.content == "") return;
            console.log({ messageId: message.id, messageAuthor: message.member.nickname || message.member.user.username, messageContent: message.content });
            const result = { messageId: message.id, messageAuthor: message.member.nickname || message.member.user.username, messageContent: message.content };
            console.log('新訊息已發送!')

            ws.send(JSON.stringify(result));
        });

        //
    });

    // app.listen(8080);

    console.log("TCP伺服器已開啟")
    // 訊息事件發生

};
console.log('機器人已開啟並上線')