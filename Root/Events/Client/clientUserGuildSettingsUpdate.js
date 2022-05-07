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
        log(
            'info',
            chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] 機器人的伺服器設定被更改！`),
            true,
            client)
    },
};
