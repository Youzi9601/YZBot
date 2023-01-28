const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('../../../bot');
const moment = require('moment');
const { Client } = require('discord.js');

module.exports = {
    name: 'reconnecting',
    once: true,
    /**
     *
     * @param {import('discord.js').Client} client 機器人
     */
    run: async (client) => {
        console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));

        // end
    },
};
