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
        log(
            'info',
            chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] 機器人的設定被更改！`),
            true,
            client)
    },
};
