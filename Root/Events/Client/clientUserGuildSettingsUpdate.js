const chalk = require('chalk');
const moment = require('moment');
const { log } = require('./../../Utils/log');
module.exports = {
    name: 'clientUserGuildSettingsUpdate',
    once: false,
    /**
     *
     * @param {clientUserGuildSettings} clientUserGuildSettings
     */
    run: async (clientUserGuildSettings) => {
        const discordmsg = {
            content: '機器人的伺服器設定被更改！',
        };
        log(
            'info',
            chalk.gray('機器人的伺服器設定被更改！'),
            true,
            client,
            discordmsg);
    },
};
