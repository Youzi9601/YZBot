const { ActivityType, time } = require('discord.js')

const humanizeDuration = require('humanize-duration');
const axios = require('axios');
const os = require('os');
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require('quick.db')
const shardStatus_data = new QuickDB().table('uptime');

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
    // 待添加自動刷新內容的功能
    // client.user.setActivity('activity', { type: ActivityType.Watching });
    // client.user.setStatus('idle');
    await wait(5000)
    const channel = client.channels.cache.get(client.config.guild.Channels.ClientStatus)
    const message = await channel.send('機器人已經啟動！')

    const timer_msg = `啟動時間： ${time(client.readyAt, 'R')}`
    for (let i = 0; client.readyTimestamp; i++) {
        const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
            conjunction: ' ',
            language: 'zh_TW',
        })} `;
        // 更新訊息
        const embed = {
            color: 0x808080,
            description: timer_msg,
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

        // 處理各個分片狀態資料

        let shards_msg = [];
        (await shardStatus_data.all()).forEach(s => {
            let status = `*** #${s.id} 未知`
            if (s.value == 'ready') {
                status = `  #${s.id} 上線`
            } else if (s.value == 'disconnect') {
                status = `-   #${s.id} 斷線`
            } else if (s.value == 'death') {
                status = `*** #${s.id} 已關閉`
            }
            shards_msg.push(status)
        })
        const shard_status = {
            color: 0x808080,
            description: `\`\`\`diff\n${shards_msg.join('\n')}\n\`\`\``,
            author: {
                name: `${client.user.username} - 機器人分片節點運行資訊`,
                iconURL: client.user.avatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: '最後更新:',
                    value: `<t:${Math.round((Date.now()) / 1000)}:R> (<t:${Math.round((Date.now()) / 1000)}:f>)`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        }
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
        message.edit({ content:'', embeds: [embed, shard_status] });

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
            const rawHtml = await axios(client.config?.youtube).then((res) => res.data);
            /* 將使用正則表達式來獲取訂閱人數 */
            const superSet = rawHtml.match(/"subscriberCountText".+?(?="tvBanner":)/s)[0];
            const subSet = superSet.match(/\d+/g); // \{"label"\:".*?"\}
            /* 如果通道名稱與 subs 相同，則停止執行 */
            subs = `${subSet[0]}`;
        } catch (error) {
            subs = '--';
        }
        const status =
            client.config?.botPresence.activities[Math.floor(Math.random() * client.config?.botPresence.activities.length)];

        // 處理狀態
        status.name =
            `${status.name}`
                .replace(/{bot.name}/g, client.user.name)
                .replace(/{count.guilds}/g, client.guilds.cache.size)
                .replace(/{count.members}/g, client.users.cache.size)
                .replace(/{Youtube.subs}/g, subs);
        status.type = status.type.toUpperCase();

        // const browser = {browser: client.config?.botPresence.browser || undefined }
        /* client.user.setPresence({
            activities: [
                {
                    name: `${status.name}`,
                    type: `${status.type}` || undefined,
                    url: `${status.url}` || undefined,
            },
    ],
    // browser: "DISCORD IOS",
    status: `${client.config?.botPresence.status}`,
    browser
    });*/
        client.user.setStatus(`${client.config?.botPresence.status}`);
        client.user.setActivity(
            `${status.name}`,
            {
                name: status.name,
                type: status.type,
                url: `${status.url || 'https://www.twitch.tv/Youzi9601'}`,
            },
        );

        // 等待
        await wait(60000);

    }


}