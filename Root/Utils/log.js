const fs = require('fs');
const moment = require('moment');
const { config } = require('./../../bot');
const chalk = require('chalk');
const { Client, Message } = require('discord.js');
const bot = require('./../../bot');
const db = require('quick.db');

module.exports = { log };

/**
 *
 * @param {等級} level log,info,warn,error
 * @param {訊息內容} msg 訊息內容
 * @param {boolean} SendToDiscord 是否傳輸到Discord?
 * @param {Message} discordmsg 訊息內容
 * @param {Client} client 機器人
 * @param {ID} channel 頻道ID(預設為 config.Channels.All 的內容)
 */
function log(level = 'log', msg, SendToDiscord = false, client = bot.client, discordmsg = undefined, channel = `${config.Channels.All}`, guild_id = undefined) {
    const prefix = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`;


    // 控制台顯示
    // log
    if (level == 'log') {
        console.log(chalk.gray(prefix) + msg);
    }
    // info
    else if (level == 'info') {
        console.info(chalk.gray(prefix) + msg);
    }
    // warn
    else if (level == 'warn') {
        console.warn(chalk.gray(prefix) + msg);
    }
    // error
    else if (level == 'error') {
        console.error(chalk.gray(prefix) + msg);
    }
    // debug
    else if (level == 'debug') {
        console.debug(chalk.gray(prefix) + msg);
    }
    // guild.logs
    else if (level == 'guild-log') {
        // const Box = require('cli-box');
        const data = [
            chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + `${msg.event} 事件`,
        ];
        data.push(msg.content, '');
        const guild_log_box = data.join('\n');
        // 紀錄本地
        console.info('╭' + '─'.repeat(75) + '\n' + guild_log_box);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, '╭' + '─'.repeat(75) + `\n${guild_log_box} `, function(err) {
            // none
        });
        // 傳輸Discord
        if (msg.event == '訊息創建') return;
        var logger_system = new db.table('logger_system');

        // 取得頻道之伺服器
        const logger_system_data = logger_system.get(`${guild_id}`) || '000';
        if (logger_system_data == '000') {
        } // 不做動作
        else {
            const logger_channel = client.channels.cache.get(logger_system_data);
            try {
                logger_channel.send({
                    embeds: [
                        {
                            description: `${guild_log_box}`,
                            color: 0x808080,
                            timestamp: new Date(),
                        },
                    ],
                });
            } catch (error) {
                //
                console.error(error);
            }
        }
        // 支援伺服器
        const log_channel = client.channels.cache.get(channel);
        try {
            log_channel.send({
                embeds: [
                    {
                        description: `${guild_log_box}`,
                        color: 0x808080,
                        timestamp: new Date(),
                    },
                ],
            });
        } catch (error) {
            //
            console.error(error);
        }

        return;
    }
    // botguild logs
    else if (level == 'botguild-log') {
        // const Box = require('cli-box');
        const data = [
            chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + `${msg.event} 事件`,
        ];
        data.push(msg.content, '');
        const guild_log_box = data.join('\n');
        // 紀錄本地
        console.info('╭' + '─'.repeat(75) + '\n' + guild_log_box);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, '╭' + '─'.repeat(75) + `\n${guild_log_box} `, function(err) {
            // none
        });

        // 傳輸Discord
        if (msg.event == '訊息創建') return;
        // 支援伺服器
        const log_channel = client.channels.cache.get(channel);
        try {
            log_channel.send({
                embeds: [
                    {
                        description: `${guild_log_box}`,
                        color: 0x808080,
                        timestamp: new Date(),
                    },
                ],
            });
        } catch (error) {
            //
            console.error(error);
        }

        return;
    }
    // 沒有level
    else {
        console.info(chalk.gray(prefix) + msg);
    }
    // 寫入檔案
    fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n${prefix}${msg} `, function(err) {
        // none
    });

    //
    if ((channel != '') && SendToDiscord) {
        const log_channel = client.channels.cache.get(
            channel,
        );
        if (log_channel == undefined) return;
        // 發送訊息
        let send = {
            content: 'ERROR: 未知的訊息',
        };
        if (!discordmsg) {
            // send.content = `> \`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜ ${msg}\`\`\``;
            send.content = null;
            send.embeds = [
                {
                    color: 0x808080,
                    description: discordmsg ||
                        `\`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜ ${msg}\`\`\``
                        || 'ERROR: 未知的訊息',
                },
            ];
        } else {
            send = discordmsg || 'ERROR: 未知的訊息';
        }

        log_channel.send(send);

    }
}