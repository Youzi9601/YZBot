const { Client, Partials, Collection, GatewayIntentBits, ApplicationCommand } = require('discord.js');
const config = require('../Config');
require("colors");

const CI = process.env.CI;
if (CI) {
    console.log(`[#${ client.shard.ids }] ` + 'CI檢查完畢');
    process.exit(0);
}

const client = new Client({
    intents: [
        // Guild
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        // GatewayIntentBits.GuildPresences,
        // DM
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        // General
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
});


// 獲取機器人令牌：
const AuthenticationToken = config.bot.token;
if (!AuthenticationToken) {
    console.warn("[CRASH] 需要 Discord 機器人的身份驗證令牌！使用 環境變數 Envrionment Secrets (.env) 或 Config.js。".red);
    return process.exit();
}

// Handler:
client.commands = {
    message_prefix: new Collection(),
    slash: new Collection(),
    contextmenu: {
        user: new Collection(),
        message: new Collection(),
    },
    button_commands: new Collection(),
    selectmenu_commands: new Collection(),
    modals: new Collection(),
};
client.events = new Collection();
// 設定
client.config = config;
// Console 日誌紀錄
client.console = require('./handlers/log');

// 語言處理
client.language = new Collection();
/**
 * 語言檔案設定與取得
 * @param {'zh_TW'} locale 語言
 * @param {String} file 資料位置，如：`檔案位置#data資料`
 * @returns {String & Array & Object} 翻譯結果(或是資料集)
 */
const tran = (locale, file) => {
    // 取得檔案位置與所需資料
    const [filePath, ...propNameArr] = file.split('#');
    const propName = propNameArr.length > 1 ? propNameArr.join('#') : propNameArr[0];
    // 取得該資料&預設資料
    const locale_data = client.language.get(locale + ':' + filePath) || undefined;
    const tw_data = client.language.get('zh-TW' + ':' + filePath) || undefined;

    if (!propName) return locale_data || tw_data;

    // 搜尋資料
    const locale_data_propValue = propName.split('.').reduce((o, i) => o ? o[i] : undefined, locale_data);
    const tw_data_propValue = propName.split('.').reduce((o, i) => o ? o[i] : undefined, tw_data);

    return locale_data_propValue || tw_data_propValue || `<translate:${ file }:null>`;
};
client.language_data = (locale, file) => tran(locale, file);

// 冷卻系統架構
client.cooldowns = new Collection();

/**
 * Client 定義
 * @returns {import('discord.js').Client & {
 * language_data: tran,
 * console: import('./handlers/log'),
 * config: import('./../Config'),
 * commands: {
 *      message_prefix: Collection,
 *      slash: Collection,
 *      contextmenu: {
 *          user: Collection,
 *          message: Collection,
 *      },
 *      button_commands: Collection,
 *      selectmenu_commands: Collection,
 *      modals: Collection,
 *      data: {
 *          global: Array<ApplicationCommand>,
 *          guild: Array<ApplicationCommand>,
 *          developer: Array<ApplicationCommand>,
 *          premium: Array<ApplicationCommand>,
 *      }
 * },
 * command_category: [],
 * events: Collection,
 * cooldowns: Collection<String, Collection<String, Number>>,
 * db: import('./handlers/database/db_function'),
 * }}
 */
const bot = () => {
    return client;
};
// module.exports.client = client; // 此行代碼因為無法定義完整的Client故註解
module.exports.client = bot();


// Hendlers
["languages_loader", "database", "events", "prefix", "application_commands", "modals", "plugins_loader-client"].forEach((file) => {
    require(`./handlers/${ file }`)(client, config);
});

// 登錄機器人
client.login(AuthenticationToken)
    .catch((err) => {
        client.console('Error', "[CRASH] 連接到您的機器人時出了點問題...");
        client.console('Error', "[CRASH] 來自 Discord API 的錯誤：" + err);
        return process.exit(1);
    });

// 處理錯誤：
process
    .on('unhandledRejection', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] unhandledRejection 未處理的拒絕： ${ err }`.red);
        client.console('Error', { promise: err });
    })
    .on('uncaughtException', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] uncaughtException 未處理的拒絕： ${ err }`.red);
        client.console('Error', { promise: err });
    })
    .on('exit', async (code) => {
        //
        console.log(`[#${ client.shard.ids }]  關機｜退出代碼: ${ code }`);
    });


// 啟動網絡 (如果分片編號是0)
if (client.shard.ids == 0
    && config.web.noWeb != 'true') {
    require('./web')(client);
}
