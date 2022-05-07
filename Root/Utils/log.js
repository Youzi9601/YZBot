const fs = require('fs');
const moment = require('moment');
const config = require('../../Config');
const chalk = require('chalk');
const { Client, Message } = require('discord.js');

module.exports = { log };

/**
 *
 * @param {等級} level info,warn,error
 * @param {訊息內容} msg 訊息內容
 * @param {boolean} SendToDiscord 是否傳輸到Discord?
 * @param {Message} discordmsg 訊息內容
 * @param {Client} client 機器人
 */
function log(level, msg, SendToDiscord, client, discordmsg) {
    if (config.Channels.All && SendToDiscord) {
        const log_channel = client.channels.cache.get(
            config.Channels.All,
        );
        // 發送訊息
        const send = {};
        if (!discordmsg) {
            send.content = `> [${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} ${`${level}`.toUpperCase()}｜ ${msg}`;
        } else {
            send = discordmsg;
        }
        log_channel.send(send);
    }
    // info
    if (level == 'info') {
        console.log(chalk.gray(
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
    }

    fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${`${level}`.toUpperCase()}｜${msg}`, function(err) {
        // none
    });
}