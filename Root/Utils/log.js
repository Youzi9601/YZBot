const fs = require('fs');
const moment = require('moment');
const config = require('../../Config');
const chalk = require('chalk');
const { Client, Message } = require('discord.js');

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
function log(level, msg, SendToDiscord = false, client, discordmsg, channel = `${config.Channels.All}`) {

    fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${`${level}`.toUpperCase()}｜${msg} `, function(err) {
        // none
    });


    // info
    if (level == 'log') {
        console.log(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    }
    // info
    else if (level == 'info') {
        console.info(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    }
    // warn
    else if (level == 'warn') {
        console.warn(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    }
    // error
    else if (level == 'error') {
        console.error(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    } else if (level == 'debug') {
        console.debug(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    } else {
        console.info(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜`,
        ) + msg);
    }

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