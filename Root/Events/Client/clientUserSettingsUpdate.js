const chalk = require('chalk');
const moment = require('moment');
const { log } = require('./../../Utils/log');

module.exports = {
    name: 'clientUserSettingsUpdate',
    once: false,
    /**
     *
     * @param {clientUserSettings} clientUserSettings
     */
    run: async (clientUserSettings) => {
        const discordmsg = {
            content: '機器人的設定被更改！',
        };
        log(
            'info',
            chalk.gray('機器人的設定被更改！'),
            true,
            client,
            discordmsg);
    },
};
