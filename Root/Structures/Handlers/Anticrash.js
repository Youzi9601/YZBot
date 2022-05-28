/**
 *
 * @param {import('./../../../bot').client} client
 */
const db = require('quick.db');
const { config } = require('./../../../bot');
const chalk = require('chalk');
const fs = require('fs');
const humanizeDuration = require('humanize-duration');

module.exports = (client) => {
    // #region 事件
    // 處理錯誤
    process
        .on('unhandledRejection', (reason, promise) => {
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );
                const msg = {};
                const embed = {};
                msg.content = `新的**錯誤**出現！ <@${config.developers[0]}>`;
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
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );

                const msg = {};
                const embed = {};
                msg.content = `新的**錯誤**出現！ <@${config.developers[0]}>`;
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
    // 設定信號退出
    const signal = ["SIGINT", "SIGTERM", "SIGQUIT", "SIGKILL", "SIGHUP"]
    signal.forEach(signal => process.on(signal, () => {
        const { oldmsg, message } = require('./../../Plugins/discord/ReadyUpdater/ReadyUpdater')
        console.log(`${signal}｜收到 ${signal} 信號，關閉機器人......`);
        console.log(
            chalk.gray(
                '\n\n───────────────────────────────機器人控制台───────────────────────────────\n',
            ),
        );
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
            description: oldmsg + '\n' + msg,
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
                    name: '運行時間:',
                    value: `${uptime}`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        try {
            message.edit({ embeds: [embed] });
        } catch (error) {

        }
        /** 程式代碼 */
        process.exit();
    }));

    // #endregion

};
