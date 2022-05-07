const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const { Channel } = require('discord.js');
module.exports = {
    name: 'channelDelete',
    once: false,
    /**
     *
     * @param {Channel} channel 頻道
     */
    run: async (channel) => {
        // console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        console.log(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${channel.tag} (${channel.type}) 已創建！`);
        // end
    },
};
