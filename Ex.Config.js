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

    // 自動更新?
    autoupdate: process.env.autoupdate || true,


    /**
    * 基本設定
    */

    // 啟動時會使用這個金鑰登入 (也就是機器人token)
    token: process.env.token || '你的機器人Token',

    // 機器人註冊 [ / ] 斜線命令 會使用這個機器人ID (填入機器人ID 或者Developer Portal的Application ID，其實都一樣。)
    clientID: process.env.clientID || '機器人ID',
    clientSECRET: process.env.clientSECRET || '機器人機密',

    // 語言(可於 ./Root/language 中自訂語言)
    language: 'zh_TW',

    // 機器人訊息命令前綴(訊息觸發，允許多個前綴！)
    // 例: ["前綴1","前綴2"]
    // 使用方式: "!ping"、">ping"
    prefix: process.env.prefix || ['>', '/', '!>'],

    // 機器人製作者們的ID，可以使用擁有者指令
    // 例: ["856918496893599805","862347263690539009","849809683085525032"]
    developers: process.env.developers || ['856918496893599805'],

    // 機器人名稱
    botName: process.env.botName || '機器人名稱',
    // 機器人狀態
    botPresence: {
        /**
         * 已廢棄
        activities: [
          {
            // 名稱
            name: `${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者`,
          },
        ],
        */

        // 狀態
        status: 'idle',
    },
    // 控制台日誌前綴名稱(可為空)
    console_prefix: process.env.console_prefix || '',

    // 控制台日誌文件紀錄天數(單位：天(= logs/ 的子目錄下的檔案數量)｜0 為永久保存紀錄｜過了這時間以後就會自動刪除)
    console_clear: process.env.console_clear || 0,

    // 伺服器邀請 (https://discord.gg/${邀請代碼})
    invite_code: process.env.invite_code || '邀請代碼',


    /**
     * 網頁
     */
    // 網頁
    web: {
        noWeb: process.env.noWeb || true,
        License_ID: process.env.License_ID || '許可代碼',
        // 網站位置
        domain: process.env.domain || 'http://localhost', // 網域
        port: process.env.port || 80,
    },
    /**
    * 機器人傳輸頻道設定
    */

    // 紀錄伺服器的ID
    ServerID: process.env.serverid || '伺服器ID',
    // 紀錄伺服器的相關頻道
    Channels: {
        // 機器人所有記錄會在這個頻道 (填入ID)
        All: process.env.All || 'ID',
        // 機器人啟動時會記錄在這個頻道 (填入ID)
        ClientOn: process.env.ClientOnChannel || 'ID',
        // 若有錯誤的回報會記錄在這個頻道 (填入ID)
        report: process.env.reportChannel || 'ID',
        // 機器人指令的使用紀錄會記錄在這個頻道 (填入ID)
        commandRec: process.env.commandRecChannel || 'ID',
        // 該伺服器的變動被記錄在這個頻道 (填入ID)
        serverRec: process.env.serverRecChannel || 'ID',
        // 機器人被邀請進入伺服器的紀錄會記錄在這個頻道 (填入ID)
        inviteChannel: process.env.inviteChannel || 'ID',
    },

    /**
    * 雜項
    */

    // 調整時差
    // 在GMT-8區為"-8",在GMT+8為"8"
    GMT: process.env.GMT || 8,


    /**
    * 機器人控制台設定
    */
    console: {
        // 是否報告 Discord Error 錯誤訊息
        error: process.env.console_error || true,
        // 是否報告 Discord Warn 警告訊息
        warn: process.env.console_warn || true,
        // 是否報告 Discord debug 除錯訊息
        debug: process.env.console_debug || false,
    },

};
