const fs = require('fs');
const moment = require('moment');
const config = require('../../Config');
const chalk = require('chalk');
const { Client } = require('discord.js');

/**
 *
 * @param {console} level info,warn,error
 * @param {msg} msg 訊息內容
 * @param {Client} client 機器人
 */
module.exports = (level, msg, client) => {
    if (config.Channels.All) {
        const log_channel = client.channels.cache.get(
            config.Channels.All,
        );
        // 發送訊息
        log_channel.send(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} [${level}] ${msg}`,
        );
    }
    if (level == 'info') {
        console.log(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] INFO｜${msg}`, function (err) {
            // none
        });
    } else if (level == 'warn') {
        console.warn(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN｜${msg}`, function (err) {
            // none
        });
    } else if (level == 'error') {
        console.error(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR｜${msg}`, function (err) {
            // none
        });
    }

};