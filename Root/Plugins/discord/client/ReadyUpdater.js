const humanizeDuration = require('humanize-duration');
const { config } = require('../../../../bot');
const axios = require('axios');
const os = require('os');
/**
 *
 * @param {import('discord.js').Message} message
 * @param {*} oldmsg
 * @param {import('discord.js').Client} client
 */
module.exports = async function(message, oldmsg, client) {
    module.exports.message = message;
    module.exports.oldmsg = oldmsg;
    // console.info('執行UpDater')
    //
    // 更新機器人狀態
    const sleep = async (ms) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms || 0);
        });
    };
    for (let i = 0; true; i++) {
        const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
            conjunction: ' ',
            language: 'zh_TW',
        })} `;
        // 更新訊息
        const embed = {
            color: 0x808080,
            description: oldmsg,
            author: {
                name: `${client.user.username} - 機器人運作資訊`,
                iconURL: client.user.avatarURL({ dynamic: true }),
            },
            fields: [
                { name: '版本:', value: `v${require('../../../../package.json').version}`, inline: true },
                { name: 'Discord.js:', value: `${require('discord.js').version}`, inline: true },
                { name: 'Node.js', value: `${process.version}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: false },
                {
                    name: 'Websocket 延遲:',
                    value: `${client.ws.ping}ms`,
                    inline: true,
                },
                {
                    name: '記憶體: ',
                    value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``,
                    inline: true,
                },
                {
                    name: 'CPU:',
                    value: `${os.cpus()[0].speed}MHz`,
                    inline: true,
                },
                {
                    name: '運行時間:',
                    value: `${uptime}`,
                    inline: true,
                },
                {
                    name: '最後更新:',
                    value: `<t:${Math.round((Date.now()) / 1000)}:R> (<t:${Math.round((Date.now()) / 1000)}:f>)`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };
        /*
         let owo = {
            content: [oldmsg,
                 `> ．Websocket 延遲: ${client.ws.ping}ms`,
                 `> ．運行時間: ${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                conjunction: ' ',
                language: 'zh_TW',
            })}`,
                 `> ．最後更新: <t:${Math.round((Date.now()) / 1000)}:R> (<t:${Math.round((Date.now()) / 1000)}:f>)`,
        ].join('\n'),
         };
        */
        message.edit({ embeds: [embed] });

        // 更新狀態
        /**
                    const message = guildData.plugins.welcome.message
                    .replace(/{user}/g, member)
        .replace(/{server}/g, member.guild.name)
        .replace(/{membercount}/g, member.guild.memberCount)
        */
        var subs = '';
        try {

            /* 獲取網站的 Html 數據 */
            const rawHtml = await axios(config.youtube).then((res) => res.data);
            /* 將使用正則表達式來獲取訂閱人數 */
            const superSet = rawHtml.match(/"subscriberCountText".+?(?="tvBanner":)/s)[0];
            const subSet = superSet.match(/\d+/g); // \{"label"\:".*?"\}
            /* 如果通道名稱與 subs 相同，則停止執行 */
            subs = `${subSet[0]}`;
        } catch (error) {
            subs = '--';
        }
        const status =
            config.botPresence.activities[Math.floor(Math.random() * config.botPresence.activities.length)];

        // 處理狀態
        status.name =
            `${status.name}`
                .replace(/{bot.name}/g, client.user.name)
                .replace(/{count.guilds}/g, client.guilds.cache.size)
                .replace(/{count.members}/g, client.users.cache.size)
                .replace(/{Youtube.subs}/g, subs);
        status.type = status.type.toUpperCase();

        // const browser = {browser: config.botPresence.browser || undefined }
        /* client.user.setPresence({
            activities: [
                {
                    name: `${status.name}`,
                    type: `${status.type}` || undefined,
                    url: `${status.url}` || undefined,
            },
    ],
    // browser: "DISCORD IOS",
    status: `${config.botPresence.status}`,
    browser
    });*/
        client.user.setStatus(`${config.botPresence.status}`);
        client.user.setActivity(
            `${status.name}`,
            {
                name: status.name,
                type: status.type,
                url: `${status.url || 'https://www.twitch.tv/Youzi9601'}`,
            },
        );

        // 等待
        await sleep(60000);

    }

    //
};
