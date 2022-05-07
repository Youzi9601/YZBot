const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const { TextChannel } = require('discord.js');
module.exports = {
    name: 'channelPinsUpdate',
    once: false,
    /**
     *
     * @param {TextChannel} channel 頻道
     * @param {Pin} time 釘選時間
     */
    run: async (channel, time) => {
        // console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        console.log(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${channel.tag} 於${time}更新了釘選訊息`);
        // end
    },
};
