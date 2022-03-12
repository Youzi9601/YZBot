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
            // 讀取檔案&寫入
            fs.readFile(`logs/${moment().format('YYYY-MM-DD')}.log`, function (err, data) {
                // 沒有將會創建新的檔案
                if (err) {
                    console.log(
                        chalk.gray(
                            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                        ) + '創建新的檔案...')

                    fs.writeFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `${moment().format('YYYY/MM/DD HH:mm:ss')} 機器人紀錄\n==========================================\n\n`, function (err) {
                        if (err)
                            console.log(err);
                    });
                }
                // 寫入檔案
                //console.log(data.toString());
                fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 事件觸發｜${event.name}`, function (err) {
                    if (err)
                        console.log(err);
                });
            });


            // 清除檔案(清理過時的檔案)
            if (config.console_clear = "0") {
                // 無
            } else {
                // 執行清除
                var dir = 'logs/'
                // 取得檔案時間排序
                fs.readdir(dir, function (err, files) {
                    files = files.map(function (fileName) {
                        return {
                            name: fileName,
                            time: fs.statSync(dir + '/' + fileName).mtime.getTime()
                        };
                    })
                        .sort(function (a, b) {
                            return a.time - b.time;
                        })
                        .map(function (v) {
                            return v.name;
                        });
                });
                console.log(files)
                for (let i = 0; i < config.console_clear; i++) {
                    const log = files[i];
                    fs.unlink(`${dir}/${log}`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }


                        //file removed
                    });

                }
            }
            /**
             * log 檔案 end
             */
            if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
            else client.on(event.name, (...args) => event.run(...args, client, container));
        });
    });
};