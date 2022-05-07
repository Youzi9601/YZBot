module.exports = { updater };
const moment = require('moment');
const humanizeDuration = require('humanize-duration');

/**
 *
 * @param {import(discord.js).Message} message
 * @param {*} oldmsg
 * @param {import('discord.js').Client} client
 */
async function updater(message, oldmsg, client) {
    // console.log('執行UpDater')
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
        await sleep(30000);
        const msg = {
            content: [oldmsg,
                `> ．Websocket 延遲: ${client.ws.ping}ms`,
                `> ．運行時間: ${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                    conjunction: ', ',
                    language: 'zh_TW',
                })}`,
                `> ．最後更新: <t:${Math.round((Date.now()) / 1000)}:R> (<t:${Math.round((Date.now()) / 1000)}:f>)`,
            ].join('\n'),
        };
        message.edit(msg);
    }

    //
}
