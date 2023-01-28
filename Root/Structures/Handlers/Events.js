const fs = require('fs');
const Filer = require('../../Utils/Filer');
const Discord = require('discord.js');
const { path } = require('../../../bot');
const { config } = require('./../../../bot');
const moment = require('moment');
const chalk = require('chalk');

module.exports = async function(client) {
    const container = {
        RootPath: path,
        Config: config,
        Discord: Discord,
    };
    Filer(`${container.RootPath}/Root/Events`, async function(err, res) {
        res.forEach(file => {
            // 執行尋找
            if (fs.statSync(file).isDirectory()) return;
            const event = require(file);
            if (event.ignoreFile) return;
            if (event.customEvent) event.run(client, container);
            client.events.set(event.name, event);
            // 寫入事件紀錄
            logging();
            function logging() {
                /**
                         * log 檔案 start
                         */
                // 讀取檔案&寫入
                try {
                    fs.mkdirSync('logs');

                } catch (error) {
                    // 代表有創建了
                }
                fs.readFile(`logs/${moment().format('YYYY-MM-DD')}.log`, function(err, data) {
                    // 如果錯誤，將會創建新的檔案
                    if (err) {

                        console.info(
                            chalk.gray(
                                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                            ) + '創建新的檔案...');

                        fs.writeFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `${moment().format('YYYY/MM/DD HH:mm:ss')} 機器人紀錄\n==========================================\n\n`, function(err) {
                            // 無動作
                        });
                    }
                    // 寫入檔案
                    // console.info(data.toString());
                    fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 事件觸發｜${event.name}`, function(err) {
                        if (err)
                            console.info(err);
                    });


                });


                // 清除檔案(清理過時的檔案)
                if (config.console_clear == 0) {
                    // 無
                } else {
                    // 執行清除
                    // 取得檔案時間排序
                    const logfiles = fs.readdirSync('logs').filter(file => file.endsWith('.log'));
                    // console.info(logfiles)
                    // 清除
                    if (logfiles) {
                        if (logfiles.length > config.console_clear) {
                            for (let i = 1; i <= config.console_clear; i++) {
                                const log = logfiles[0];
                                fs.unlink(`logs/${log}`, (err) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.info(`${moment().format('YYYY/MM/DD HH:mm:ss')} ${log} 成功被刪除`);

                                    // file removed
                                });

                            }
                        }
                    }
                }
                /**
                 * log 檔案 end
                 */
            }
            // 執行事件
            if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
            else client.on(event.name, (...args) => event.run(...args, client, container));
        });
    });
};
