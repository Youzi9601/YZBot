const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../Config.js');
const moment = require('moment');
const { Client } = require('discord.js');

module.exports = {
    name: 'reconnecting',
    once: true,
    /**
     *
     * @param {Client} client
     */
    run: async (client) => {
        console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));

        // end
    },
};