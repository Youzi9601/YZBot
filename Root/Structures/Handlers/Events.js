const fs = require('fs');
const Filer = require('../../Utils/Filer');
const Discord = require('discord.js');
const { path, config } = require('../../../bot');
const moment = require('moment');
const chalk = require('chalk');

module.exports = async function (client) {
    const container = {
        RootPath: path,
        Config: config,
        Discord: Discord,
    };
    Filer(`${container.RootPath}/Root/Events`, async function (err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const event = require(file);
            if (event.ignoreFile) return;
            if (event.customEvent) event.run(client, container);
            client.events.set(event.name, event);
            /**
             * log 檔案 start
             */
            fs.readFile(`logs/${moment().format('YYYY-MM-DD')}.txt`, function (err, data) {
                if (err) {
                    console.log(
                        chalk.gray(
                            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                        ) + '創建新的檔案...')

                    fs.writeFile(`logs/${moment().format('YYYY-MM-DD')}.txt`, `${moment().format('YYYY/MM/DD HH:mm:ss')} 機器人紀錄\n==========================================\n\n`, function (err) {
                        if (err)
                            console.log(err);
                    });
                }

                //console.log(data.toString());
                fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.txt`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 事件觸發｜${event.name}`, function (err) {
                    if (err)
                        console.log(err);
                });
            });
            /**
             * log 檔案 end
             */
            if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
            else client.on(event.name, (...args) => event.run(...args, client, container));
        });
    });
};