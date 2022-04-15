const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../Config.js');
const moment = require('moment');

module.exports = {
    name: 'disconnect',
    once: true,
    run: async (client) => {
        console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgRed.bold('機器人斷開連線！'));

    // end
    },
};
