const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../Config.js');
const moment = require('moment');

module.exports = {
    name: 'reconnecting',
    once: true,
    run: async (client) => {
        console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('機器人重新連線！'));

    // end
    },
};
