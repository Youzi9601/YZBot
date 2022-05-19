/*
更新機器人
Heroku 無法更新
*/

module.exports = { config_update };
const fs = require('fs');
const childProcess = require('child_process');

async function update() {
    const exec = require('child_process').exec;
    if (fs.existsSync('./.git')) {
        exec('git reset --hard');
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]開始檢查更新......');
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]套用Config資料......');
        await config_update();
        exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            // console.log('' + stdout + '');
            if (!stdout.includes('Already up to date.')) {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]更新成功！請重新啟動！');
                process.exit(1);
            } else {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]沒有新的更新！');
            }

        });
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]安裝依賴項......');
        childProcess.exec('npm install', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            console.log('' + stdout + '');
            console.log('\x1b[32m%s\x1b[0m', '[基本作業] Package.json 中的依賴項安裝完成！');
            // exec('node bot.js');

        });
    } else {
        console.log('\x1b[31m%s\x1b[0m', '沒有 git 存儲庫！將為您創立一個！');

        exec('git clone https://github.com/Youzi9601/YZBot', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]無法創建！取消自動更新！');
                return;
            } else {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]創立成功！請將新增的資料夾(YZBot)內的所有內容放置主目錄，並重新啟動機器人！');
                process.exit(0);
            }

        });

    }
}
update();

async function config_update(config = config) {
    const { config } = require('./../../bot');
    require('fs').writeFileSync('Config.js', `
require('dotenv').config();
module.exports = {
    /**
     *
     * Config 設定檔案
     * > 這是一個設定檔案，裡面的相關設定可以自由填寫！
     *
     * 格式：
     * // 敘述內容
     * 設定名稱: process.env.設定名稱(我們預設的) || "您要填寫的內容"
     * (process.env.設定名稱 的設定檔案位在 ".env" 檔案裡面！)
     *
     * 建議：
     * 可多加利用 伺服器->設定->整合->機器人整合
     * 來調整相關命令的使用權限喔！
     *
     */

    // 自動更新? (建議不要開啟)
    autoupdate: process.env.autoupdate || ${config.autoupdate || false},

    /**
    * 基本設定
    */

    // 啟動時會使用這個金鑰登入 (也就是機器人token)
    token: process.env.token || \'${config.token || '機器人Token'}\',

    // 機器人註冊 [ / ] 斜線命令 會使用這個機器人ID (填入機器人ID 或者Developer Portal的Application ID，其實都一樣。)
    clientID: process.env.clientID || \'${config.clientID || '機器人ID'}\',
    clientSECRET: process.env.clientSECRET || \'${config.clientSECRET || '機器人密碼'}\',

    // 語言(可於 ./Root/language 中自訂語言)
    language: \'${config.language || 'zh-TW'}\',

    // 機器人訊息命令前綴(訊息觸發，允許多個前綴！)
    // 例: ["前綴1","前綴2"]
    // 使用方式: "!ping"、">ping"
    prefix: process.env.prefix || ${JSON.stringify(config.prefix, null, 2) || JSON.stringify(['>', '/', '!>'], null, 2)},

    // 機器人製作者們的ID，可以使用擁有者指令
    // 例: ["856918496893599805","862347263690539009","849809683085525032"]
    developers: process.env.developers || ${JSON.stringify(config.developers, null, 2) || JSON.stringify(['856918496893599805'], null, 2)},

    // 機器人名稱
    botName: process.env.botName || \'${config.botName || '機器人'}\',

    // 機器人狀態
    botPresence: {
        activities: [
            /**
             * 例：
             *
             * {
             * // 名稱
             *   name: \`狀態名稱\`,
             * // 類別，可為："PLAYING","STREAMING","LISTENING","WATCHING","CUSTOM","COMPETING"
             *   type: \`類別\`,
             * // 如果type為"Streaming"可使用以下來輸入網址！(如果沒有則無效)
             *   url: \`網址\`,
             * }
             *
             * // 可用變數：
             * {bot.name} - 機器人名字
             * {count.guilds} - 伺服器數量
             * {count.members} - 使用者數量
             * {Youtube.subs} - Youtube 訂閱者數量 (需要在 "Youtube.url" 的選項中輸入連結！)
             */
            ${JSON.stringify(config.botPresence.activities, null, 2) || JSON.stringify(
        [
            {
                type: 'WATCHING',
                name: '{count.guilds}個伺服器&{count.members}個使用者',
            },
            {
                name: '訂閱 Youzi9601 ！',
                type: 'STREAMING',
                url: 'https://www.twitch.tv/Youzi9601',
            },
            {
                name: 'Youzi9601 訂閱數：{Youtube.subs}位！',
                type: 'COMPETING',
            },
        ], null, 2)}
        ],
        // 狀態
        status: \'${config.botPresence.status || 'idle'}\',
    },


    /**
     *
     * 日誌輸出
     *
     */
    // 控制台日誌前綴名稱(可為空)
    console_prefix: process.env.console_prefix || \'${config.console_prefix || ''}\',

    // 控制台日誌文件紀錄天數(單位：天，等同 ./logs/ 的子目錄下的檔案數量｜0 為永久保存紀錄｜過了這時間以後就會自動刪除)
    console_clear: process.env.console_clear || ${config.console_clear || 0},

    // 伺服器邀請 (https://discord.gg/\$\{邀請代碼\})
    invite_code: process.env.invite_code || \'${config.invite_code || '邀請代碼'}\',

    /**
    * 機器人傳輸頻道設定
    */
    // 紀錄伺服器的ID
    ServerID: process.env.serverid || \'${config.ServerID || '伺服器ID'}\',
    // 紀錄伺服器的相關頻道
    Channels: {
        // 機器人所有記錄會在這個頻道 (填入ID)
        All: process.env.Channels_All || \'${config.Channels.All || 'ID'}\',
        // 機器人啟動時會記錄在這個頻道 (填入ID)
        ClientOn: process.env.Channels_ClientOnChannel || \'${config.Channels.ClientOn || 'ID'}\',
        // 若有錯誤的回報(各種)會記錄在這個頻道 (填入ID)
        report: process.env.Channels_reportChannel || \'${config.Channels.report || 'ID'}\',
        // 機器人指令的使用紀錄會記錄在這個頻道 (填入ID)
        commandRec: process.env.Channels_commandRecChannel || \'${config.Channels.commandRec || 'ID'}\',
        // 該伺服器的變動被記錄在這個頻道 (填入ID)
        serverRec: process.env.Channels_serverRecChannel || \'${config.Channels.serverRec || 'ID'}\',
        // 機器人被邀請進入伺服器的紀錄會記錄在這個頻道 (填入ID)
        inviteChannel: process.env.Channels_inviteChannel || \'${config.Channels.inviteChannel || 'ID'}\',
    },

    /**
    * 機器人控制台設定
    */
    console: {
        // 是否報告 Discord Error 錯誤訊息
        error: process.env.console_console_error || ${config.console.error || true},
        // 是否報告 Discord Warn 警告訊息
        warn: process.env.console_console_warn || ${config.console.warn || true},
        // 是否報告 Discord debug 除錯訊息
        debug: process.env.console_console_debug || ${config.console.debug || false},
    },
    /**
    * 網頁
    */
    // 網頁
    web: {
        noWeb: process.env.web_noWeb || ${config.web.noWeb || true},
        License_ID: process.env.web_License_ID || \'${config.web.License_ID || '許可代碼'}\',
        // 網站位置
        domain: process.env.web_domain || \'${config.web.domain || 'http://localhost'}\',
        port: process.env.web_port || ${config.web.port || 80},
    },
    /**
     * Webhook 投票推播
     */
    webhook: {
        use: process.env.webhook_use || ${config.webhook.use || false},
        // 你自訂的認證ID
        authorization: process.env.webhook_authorization || \'${config.webhook.authorization || 'auth_passwArd'}\',
        // Webhook接收的連接埠
        port: process.env.webhook_port || \'${config.webhook.port || '3000'}\',
        // 傳回投票的頻道
        channel: process.env.webhook_channel || \'${config.webhook.channel || '頻道ID'}\',
    },

    /**
    * 雜項
    */

    // 調整時差
    // 在GMT-8區為"-8",在GMT+8為"8"
    GMT: process.env.GMT || ${config.GMT || 8},
    youtube: \'${config.youtube || 'https://www.youtube.com/channel/UCGLbazmDlVg22pO6aGuSRsw'}\',
    plugins: {
        // 抽獎系統
        giveaways: {
            // 是否要顯示創辦者?
            host_user: ${config.plugins.giveaways.host_user || true},
            // 提及所有人?
            everyoneMention: ${config.plugins.giveaways.everyoneMention || false},
        },
    },

    /**
     *
     * 開發(測試)版本
     * // 這功能絕大部分都不能使用！
     */
    beta: {
        // RPC為Discord遊戲狀態顯示系統，目前為測試版
        rpc: {
            run: process.env.rpc_run || false,
            setActivity: {
                details: '一個實用的機器人',
                state: '運作中...',
                startTimestamp: Date.now(),
                largeImageKey: 'yzb-5',
                largeImageText: 'YZB',
                smallImageKey: 'discord_icon_-_',
                smallImageText: '柚子Youzi 大本營',
            },
        },

    },
};
    `);
    console.log('\x1b[32m%s\x1b[0m', 'Config檔案已經更新！');
}
