const { config } = require('./../../../bot');
const chalk = require('chalk');
const humanizeDuration = require('humanize-duration');
const { Missing_Permissions } = require('./Missing_Permissions');
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
            if (`${reason.message}`.includes('Unknown interaction')
                || `${reason.message}`.includes('Request failed with status code 500')
                || `${reason.message}`.includes('Unknown message')
                || `${reason.message}`.includes('reason: getaddrinfo ENOTFOUND discord.com')
            ) return; // 避免非機器人端的錯誤導致輸出錯誤

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
                if (`${reason.message}`.includes('Missing Permissions')
                    || `${reason.message}`.includes('Missing Access')
                    || `${reason.message}`.includes('Unknown message')
                    || `${reason.message}`.includes('reason: getaddrinfo ENOTFOUND discord.com')
                ) return;

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
        })
        .on('beforeExit', async (code) => {
            console.log('\n\n\n\n\n');
            console.log(code);
            console.log('=== 退出前 Before Exit ===\n\n\n\n\n'.toUpperCase());
        })
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
            const { oldmsg, message } = require('../../Plugins/discord/client/ReadyUpdater');
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
