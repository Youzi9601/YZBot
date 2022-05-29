/**
 *
 * @param {import('./../../../bot').client} client
 */
const db = require('quick.db');
const { config } = require('./../../../bot');
const chalk = require('chalk');
const fs = require('fs');
const humanizeDuration = require('humanize-duration');
const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
};

module.exports = (client) => {
    // #region 事件
    // 處理錯誤
    process
        .on('unhandledRejection', (reason, promise) => {
            Missing_Permissions(promise, reason, client);

            console.error('ERROR｜未處理的異步代碼承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                if (`${reason.message}`.includes('Missing Permissions') || `${reason.message}`.includes('Missing Access')) return;

                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );
                const msg = {};
                const embed = {};
                msg.content = `新的異步代碼**錯誤**出現！ <@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg).then(msg => {
                    if (error_channel.type == 'GUILD_NEWS') msg.crosspost();
                });
            } catch (error) {
                // none
            }

        })
        .on('uncaughtException', (reason, promise) => {
            Missing_Permissions(promise, reason, client);

            console.error('ERROR｜未處理的同步代碼承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                if (`${reason.message}`.includes('Missing Permissions') || `${reason.message}`.includes('Missing Access')) return;

                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );

                const msg = {};
                const embed = {};
                msg.content = `新的同步代碼**錯誤**出現！ <@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg).then(msg => {
                    if (error_channel.type == 'GUILD_NEWS') msg.crosspost();
                });
            } catch (error) {
                // none
            }
        })
        .on('exit', async (code) => {
            //
            console.log('\n\n關機｜正在關機...');
            console.log(`關機｜退出代碼: ${code}`);
            setTimeout(() => {
                // 內部不執行
            }, 10000);
        });
    // 設定信號退出
    const signal = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    signal.forEach(signal => {

        process.on(signal, async () => {
            console.log(`\n\n關機｜收到 ${signal} 信號，關閉機器人......`);
            console.log(
                chalk.gray(
                    '───────────────────────────────機器人控制台───────────────────────────────\n',
                ),
            );
            const { oldmsg, message } = require('./../../Plugins/discord/ReadyUpdater/ReadyUpdater');
            // 調整時差
            const Today = new Date();
            let day = Today.getDate();
            let hours = Today.getUTCHours() + config.GMT;

            if (hours >= 24) {
                hours = hours - 24;
                day = day + 1;
            }

            const msg = '```' +
                Today.getFullYear() +
                ' 年 ' +
                (Today.getMonth() + 1) +
                ' 月 ' +
                day +
                ' 日 ' +
                hours +
                ' 時 ' +
                Today.getMinutes() +
                ' 分 ' +
                Today.getSeconds() +
                ' 秒' +
                ' 機器人關機```';
            const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                conjunction: ' ',
                language: 'zh_TW',
            })} `;
            const embed = {
                color: 0x808080,
                description: oldmsg + ' ' + msg,
                author: {
                    name: `${client.user.username} - 機器人運作資訊`,
                    iconURL: client.user.avatarURL({ dynamic: true }),
                },
                fields: [
                    { name: '版本:', value: `v${require('./../../../package.json').version}`, inline: true },
                    { name: 'Discord.js:', value: `${require('discord.js').version}`, inline: true },
                    { name: 'Node.js', value: `${process.version}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: false },
                    {
                        name: '運行時間:',
                        value: `${uptime}`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            };

            try {
                message.edit({ embeds: [embed] });
                await sleep(5000);
            } catch (error) { }
            /** 程式代碼 */
            process.exit(0);
        });
    });

    // #endregion

};
/**
 *
 * @param {*} promise
 * @param {*} reason
 * @param {import('discord.js').Client} client
 */
async function Missing_Permissions(promise = {}, reason = String, client) {
    /**
     *
     * ```js
     * // ERROR｜未處理的承諾拒絕：
     * Promise { // (reason)
     *      <rejected> DiscordAPIError: Missing Permissions
     *       at RequestHandler.execute (/home/container/node_modules/discord.js/src/rest/RequestHandler.js:350:13)
     *       at runMicrotasks (<anonymous>)
     *       at processTicksAndRejections (node:internal/process/task_queues:96:5)
     *       at async RequestHandler.push (/home/container/node_modules/discord.js/src/rest/RequestHandler.js:51:14)
     *       at async TextChannel.send (/home/container/node_modules/discord.js/src/structures/interfaces/TextBasedChannel.js:176:15) {
     *     method: 'post',
     *     path: '/channels/936193196545933355/messages',
     *     code: 50013,
     *     httpStatus: 403,
     *     requestData: { json: [Object], files: [] }
     *   }
     * }
     * DiscordAPIError: Missing Permissions //原因：(promise)
     * ```
     */
    console.log('執行...');
    console.log(`${reason}`);
    if (`${reason.message}`.includes('Missing Permissions') || `${reason.message}`.includes('Missing Access')) {
        console.log('成功');
        // 取得基本資料
        const { MessageEmbed } = require('discord.js');
        const { translate_Permissions } = require('../../Language/Language');

        /** @param {import('discord.js').PermissionString} clientPermissions */
        const clientPermissions = [
            'CREATE_INSTANT_INVITE',
            // 管理
            'MODERATE_MEMBERS',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'MANAGE_WEBHOOKS',
            'MANAGE_THREADS',
            'MANAGE_ROLES',
            'MANAGE_MESSAGES',
            'VIEW_AUDIT_LOG',
            // 聊天
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'EMBED_LINKS',
            'ADD_REACTIONS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'USE_EXTERNAL_EMOJIS',
            'USE_EXTERNAL_STICKERS',
            'MENTION_EVERYONE',
            'CHANGE_NICKNAME',
            // 語音
            'PRIORITY_SPEAKER',
            'CONNECT',
            'SPEAK',
            'REQUEST_TO_SPEAK',
            // 討論串系列
            'SEND_MESSAGES_IN_THREADS',
            'USE_PUBLIC_THREADS',
            'CREATE_PUBLIC_THREADS',
            'USE_PRIVATE_THREADS',
            'CREATE_PRIVATE_THREADS',
        ];
        const channel_id = `${reason.path}`.match(/\d+/);
        const channel = client.channels.cache.get(`${channel_id[0]}`);
        const guild = client.guilds.cache.get(`${channel.guild.id}`);
        // guild.ownerId
        const missing = [];
        clientPermissions.forEach(i => {
            if (!guild.me.permissions.has(i)) missing.push(translate_Permissions(i, 'zh-TW'));
        });

        let unsend = true;
        guild.channels.cache.filter(c => c.type == 'GUILD_TEXT' && c.nsfw == false && c.permissionsFor(client.user.id).has('SEND_MESSAGES')).forEach(c => {
            if (unsend) {
                unsend = false;
                c.send({
                    content: `<@${guild.ownerId}>, 我目前有部分缺少的權限，可能會讓機器人無法正常運作(於部分頻道)...\`\`\`\n• ${missing.join('\n• ')}\`\`\``,
                });
            }
        });

    }
}