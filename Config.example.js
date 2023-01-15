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
    autoupdate: process.env.autoupdate || true,
    commit: process.env.commit || false,

    /**
    * 基本設定
    */

    // 啟動時會使用這個金鑰登入 (也就是機器人token)
    token: process.env.token || '你的機器人Token',

    // 機器人註冊 [ / ] 斜線命令 會使用這個機器人ID (填入機器人ID 或者Developer Portal的Application ID，其實都一樣。)
    clientID: process.env.clientID || '機器人ID',
    clientSECRET: process.env.clientSECRET || '機器人密碼',

    // 語言(可於 ./Root/language 中自訂語言)
    language: 'zh-TW',

    // 機器人訊息命令前綴(訊息觸發，允許多個前綴！)
    // 例: ["前綴1","前綴2"]
    // 使用方式: "!ping"、">ping"
    prefix: process.env.prefix || ['>', '/', '!>'],

    // 機器人製作者們的ID，可以使用擁有者指令
    // 例: ["856918496893599805","862347263690539009","849809683085525032"]
    developers: process.env.developers || ['856918496893599805'],

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
        ],
        // 狀態
        status: 'idle',
    },

    // 機器人所需要的所有權限
    botPermissions: [
        "CREATE_INSTANT_INVITE",
        // 管理
        "MODERATE_MEMBERS",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_CHANNELS",
        //"MANAGE_GUILD",
        "MANAGE_WEBHOOKS",
        "MANAGE_THREADS",
        //"MANAGE_ROLES",
        "MANAGE_MESSAGES",
        //"MANAGE_NICKNAMES",
        "VIEW_AUDIT_LOG",
        // 聊天
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "EMBED_LINKS",
        "ADD_REACTIONS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "USE_EXTERNAL_EMOJIS",
        "USE_EXTERNAL_STICKERS",
        "MENTION_EVERYONE",
        "CHANGE_NICKNAME",
        // 語音
        "PRIORITY_SPEAKER",
        "CONNECT",
        "SPEAK",
        "REQUEST_TO_SPEAK",
        "MOVE_MEMBERS",
        // 討論串系列
        "SEND_MESSAGES_IN_THREADS",
        "USE_PUBLIC_THREADS",
        "CREATE_PUBLIC_THREADS",
        "USE_PRIVATE_THREADS",
        //"CREATE_PRIVATE_THREADS",
    ],


    /**
     *
     * 日誌輸出
     *
     */
    // 控制台日誌前綴名稱(可為空)
    console_prefix: process.env.console_prefix || '',

    // 控制台日誌文件紀錄天數(單位：天，等同 ./logs/ 的子目錄下的檔案數量｜0 為永久保存紀錄｜過了這時間以後就會自動刪除)
    console_clear: process.env.console_clear || 0,

    // 伺服器邀請 (https://discord.gg/${邀請代碼})
    invite_code: process.env.invite_code || '邀請代碼',

    /**
    * 機器人傳輸頻道設定
    */
    // 紀錄伺服器的ID
    ServerID: process.env.serverid || '伺服器ID',
    // 紀錄伺服器的相關頻道
    Channels: {
        // 機器人所有記錄會在這個頻道 (填入ID)
        All: process.env.Channels_All || 'ID',
        // 機器人啟動時會記錄在這個頻道 (填入ID)
        ClientOn: process.env.Channels_ClientOnChannel || 'ID',
        // 若有錯誤的回報(各種)會記錄在這個頻道 (填入ID)
        report: process.env.Channels_reportChannel || 'ID',
        // 機器人指令的使用紀錄會記錄在這個頻道 (填入ID)
        commandRec: process.env.Channels_commandRecChannel || 'ID',
        // 該伺服器的變動被記錄在這個頻道 (填入ID)
        serverRec: process.env.Channels_serverRecChannel || 'ID',
        // 機器人被邀請進入伺服器的紀錄會記錄在這個頻道 (填入ID)
        inviteChannel: process.env.Channels_inviteChannel || 'ID',
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
    * 網頁
    */
    // 網頁
    web: {
        noWeb: process.env.web_noWeb || true,
        License_ID: process.env.web_License_ID || '許可代碼',
        // 網站位置
        domain: process.env.web_domain || 'http://localhost',
        port: process.env.web_port || 80,
    },
    /**
     * Webhook 投票推播
     */
    webhook: {
        use: process.env.webhook_use || false,
        // 你自訂的認證ID
        authorization: process.env.webhook_authorization || 'auth_passwArd',
        // Webhook接收的連接埠
        port: process.env.webhook_port || '3000',
        // 傳回投票的頻道
        channel: process.env.webhook_channel || '頻道ID',
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
        /*
        chatgpt: {
            email: process.env.openai_email || "",
            password: process.env.openai_password || "",
            markdown: false
        }
        */
    },

    /**
     * 
     * 分片系統(允許跨主機使用同一個機器人/減少機器人過多的執行問題)
     * 
     * *注意：這是一個危險的功能！
     * 用於：2000個伺服器以上的機器人
     * 需要：至少2台主機(一台為主要核心，
     * 另一台為機器人執行專案，機器人執行專案可以多個，但需要互相呼叫。)
     * 
     */
    hosting: {
        ip: process.env.hosting_ip || 'localhost',
        // 主核心的port
        port: process.env.hosting_port || '4444',
        // 驗證的密碼(隨意填寫，但每個主機要相同，否則無法連線)
        authToken: process.env.hosting_authToken || 'yzbBot_authToken',
        // 分片數量(建議自動)
        totalShards: process.env.hosting_totalShards || 'auto',
        // 主機的數量(運行機器人的主機數輛)
        totalMachines: process.env.hosting_totalMachines || '1',

    },
    sharding: {
        // 生成數量(預設自動)
        amount: process.env.sharding_amount || 'auto'
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

