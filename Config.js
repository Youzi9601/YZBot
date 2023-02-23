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
     * 部分設定會希望放在".env"中，以免重要的密鑰等訊息遭到濫用！
     *
     * 建議：
     * 可多加利用 伺服器->設定->整合->機器人整合
     * 來調整相關命令的使用權限喔！
     *
     */


    /**
    * 基本設定
    */
    update: {
        // 自動更新
        auto: process.env.update_auto || false,
        // 自動安裝所有的npm包?
        install_package: process.env.update_install_package || true,
    },

    bot: {
        // 啟動時會使用這個金鑰登入 (也就是機器人token)
        token: process.env.token,

        // 機器人註冊 [ / ] 斜線命令 會使用這個機器人ID (填入機器人ID 或者Developer Portal的Application ID，其實都一樣。)
        clientID: process.env.clientID,
        clientSECRET: process.env.clientSECRET,

        // 機器人的權限(用數字表示)
        permissionID: process.env.clientPermissionID || 543312702935,
    },


    /**
     *
     * 分片系統(使用同一個機器人但為伺服器分區，減少機器人過多的執行問題)
     *
     * *注意：這必須使用！
     * 用於：2000個伺服器以上的機器人
     *
     */
    sharding: {
        // 生成數量(預設自動)
        amount: process.env.sharding_amount || 'auto',
        // 是否在控制台中輸出 分片廣播 所回傳的全部分片資料(不建議啟用，因為紀錄會太多)
        logFetchClientValues: false,
    },

    /**
    * 網頁
    */
    // 網頁
    web: {
        noWeb: process.env.web_noWeb || true,
        // 網站位置
        domain: process.env.web_domain || 'http://localhost',
        port: process.env.web_port || 80,

        // 網頁的加密&解密 (secret)
        secret: process.env.web_secret || 'owo',
        // 網站的連結
        links: {
            github: 'https://github.com/Youzi9601',
            discord: 'https://discord.gg/HKekqu9hWW',
        },
        // 網站最大上限數量於時間內
        maxVisitor: {
            count: process.env.web_maxVisitorCount || 300,
            minute: process.env.web_maxVisitorInMinute || 10,
        },
    },


    // 資料庫
    database: {
        // 請放置網址於下方，用來連接到資料庫
        MongoDB: "",
    },

    // 機器人訊息命令前綴(訊息觸發，允許多個前綴！)
    // 例: ["前綴1","前綴2"]
    // 使用方式: "!ping"、">ping"
    prefix: process.env.prefix || [
        '>',
        '/',
        '!>',
    ],

    // 機器人製作者們的ID，可以使用擁有者指令
    // 例: ["856918496893599805","862347263690539009","849809683085525032"]
    developers: process.env.developers || [
        '856918496893599805',
    ],

    // 機器人名稱
    botName: process.env.botName || '機器人',

    // 機器人狀態
    botPresence: {
        activities: [
            /**
             * 例：
             *
             * {
             * // 名稱
             *   name: `狀態名稱`,
             * // 類別，可為："PLAYING","STREAMING","LISTENING","WATCHING","CUSTOM","COMPETING"
             *   type: `類別`,
             * // 如果type為"Streaming"可使用以下來輸入網址！(如果沒有則無效)
             *   url: `網址`,
             * }
             *
             * // 可用變數：
             * {bot.name} - 機器人名字
             * {count.guilds} - 伺服器數量
             * {count.members} - 使用者數量
             * {Youtube.subs} - Youtube 訂閱者數量 (需要在 "Youtube.url" 的選項中輸入連結！)
             */

            {
                'type': 'WATCHING',
                'name': '{count.guilds}個伺服器&{count.members}個使用者',
            },
            {
                'name': '訂閱 Youzi9601 ！',
                'type': 'STREAMING',
                'url': 'https://www.twitch.tv/Youzi9601',
            },
            {
                'name': 'Youzi9601 訂閱數：{Youtube.subs}位！',
                'type': 'COMPETING',
            },

        ],
        // 狀態
        status: 'idle',
    },


    /**
     *
     * 日誌輸出
     *
     */

    // 控制台日誌文件紀錄天數(單位：天，等同 ./logs/ 的子目錄下的檔案數量｜0 為永久保存紀錄｜過了這時間以後就會自動刪除)
    console_clear: process.env.console_clear || 3,

    /**
     * 機器人傳輸頻道設定
    */
    guild: {
        // 伺服器邀請 (https://discord.gg/${邀請代碼})
        invite_code: process.env.invite_code || 'Vq3F8DUNzf',
        // 紀錄伺服器的ID
        ServerID: process.env.serverid || '769587106300428328',
        // 紀錄伺服器的相關頻道
        Channels: {
        // 機器人所有記錄會在這個頻道 (填入ID)
            All: process.env.Channels_All || '940610972454912042',
            // 機器人啟動時會記錄在這個頻道 (填入ID)
            ClientStatus: process.env.Channels_ClientStatus || '940610972454912042',
            // 機器人啟動時會記錄在這個頻道 (填入ID)
            ClientOn: process.env.Channels_ClientOnChannel || '940610972454912042',
            // 若有錯誤的回報(各種)會記錄在這個頻道 (填入ID)
            report: process.env.Channels_reportChannel || '940610972454912042',
            // 機器人指令的使用紀錄會記錄在這個頻道 (填入ID)
            commandRec: process.env.Channels_commandRecChannel || '940610972454912042',
            // 該伺服器的變動被記錄在這個頻道 (填入ID)
            serverRec: process.env.Channels_serverRecChannel || '940610972454912042',
            // 機器人被邀請進入伺服器的紀錄會記錄在這個頻道 (填入ID)
            inviteChannel: process.env.Channels_inviteChannel || '940610972454912042',
        },
    },

    /**
    * 機器人控制台設定
    */
    console: {
        // 是否報告 Discord Error 錯誤訊息
        error: process.env.console_console_error || true,
        // 是否報告 Discord Warn 警告訊息
        warn: process.env.console_console_warn || true,
        // 是否報告 Discord debug 除錯訊息
        debug: process.env.console_console_debug || false,
    },

    /**
     * Webhook 投票推播
     */
    webhook: {
        use: process.env.webhook_use || true,
        // 你自訂的認證ID
        authorization: process.env.webhook_authorization || 'yzb_tester',
        // Webhook接收的連接埠
        port: process.env.webhook_port || '3000',
        // 傳回投票的頻道
        channel: process.env.webhook_channel || '976709522016043058',
    },

    /**
        * 雜項
        */

    // 調整時差
    // 在GMT-8區為"-8",在GMT+8為"8"
    GMT: process.env.GMT || 8,
    youtube: 'https://www.youtube.com/channel/UCGLbazmDlVg22pO6aGuSRsw',
    plugins: {
        // 抽獎系統
        giveaways: {
            // 是否要顯示創辦者?
            host_user: true,
            // 提及所有人?
            everyoneMention: false,
        },
        openaiKEY: process.env.openaiKEY || '你的API密鑰',
    },


    /**
         *
         * 開發(測試)版本
         * // 這功能絕大部分都不能使用！
         */
    beta: {
        // RPC為Discord遊戲狀態顯示系統，目前為測試版
        no: '沒東西',
    },
};
