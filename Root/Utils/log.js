const fs = require('fs');
const moment = require('moment');
const config = require('../../Config');
const chalk = require('chalk');

module.exports = (level, msg) => {

    if (level == 'info') {
        console.log(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] INFO｜${msg}`, function(err) {
            // none
        });
    } else if (level == 'warn') {
        console.warn(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN｜${msg}`, function(err) {
            // none
        });
    } else if (level == 'error') {
        console.error(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + msg);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR｜${msg}`, function(err) {
            // none
        });
    }

};