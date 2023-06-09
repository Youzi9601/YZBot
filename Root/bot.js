const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../Config');
require("colors");

const CI = process.env.CI;
if (CI) {
    console.log(`[#${client.shard.ids}] ` + 'CI檢查完畢');
    process.exit(0);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
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
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.contextmenu_user_commands = new Collection();
client.contextmenu_message_commands = new Collection();
client.button_commands = new Collection();
client.selectmenu_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();
// 設定
client.config = config;
// Console 日誌紀錄
client.console = require('./handlers/log');

// 語言設定
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

    return locale_data_propValue || tw_data_propValue || `<translate:${file}:null>`;
};
client.language_data = (locale, file) => tran(locale, file);


/**
 * Client 定義
 * @returns {import('discord.js').Client & {
 * language_data: tran,
 * console: import('./handlers/log'),
 * config: import('./../Config'),
 * prefix_commands: Collection,
 * slash_commands: Collection,
 * contextmenu_user_commands: Collection,
 * contextmenu_message_commands: Collection,
 * button_commands: Collection,
 * selectmenu_commands: Collection,
 * modals: Collection,
 * events: Collection
 * }}
 */
const bot = () => {
    return client;
};
// module.exports.client = client; // 此行代碼因為無法定義完整的Client故註解
module.exports.client = bot();


// Hendlers
["prefix", "application_commands", "modals", "events", "database", "languages_loader", "plugins_loader-client"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// 登錄機器人
client.login(AuthenticationToken)
    .catch((err) => {
        client.console('Error', "[CRASH] 連接到您的機器人時出了點問題...");
        client.console('Error', "[CRASH] 來自 Discord API 的錯誤：" + err);
        return process.exit();
    });

// 處理錯誤：
process
    .on('unhandledRejection', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] unhandledRejection 未處理的拒絕： ${ err }`.red);
        client.console('Error', { promise:  err });
    })
    .on('uncaughtException', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] uncaughtException 未處理的拒絕： ${ err }`.red);
        client.console('Error', { promise:  err });
    })
    .on('exit', async (code) => {
        //
        console.log(`[#${client.shard.ids}]  關機｜退出代碼: ${ code }`);
    });


// 啟動網絡 (如果分片編號是0)
if (client.shard.ids == 0
    && config.web.noWeb != 'true') {
    require('./web')(client);
}
