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
 * @param {} file 檔案
 * @returns langs
 */
client.language_data = (locale, file) => {
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

    return locale_data_propValue || tw_data_propValue;
};


module.exports = client;

["prefix", "application_commands", "modals", "events", "database", "languages_loader", "plugins_loader-client"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
    .catch((err) => {
        client.console('Error', "[CRASH] 連接到您的機器人時出了點問題...");
        client.console('Error', "[CRASH] 來自 Discord API 的錯誤：" + err);
        return process.exit();
    });

// Handle errors:
process
    .on('unhandledRejection', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] 未處理的拒絕： ${ err }`.red);
        client.console('Error', undefined, undefined, undefined, promise);
    })
    .on('uncaughtException', async (err, promise) => {
        client.console('Error', `[ANTI-CRASH] 未處理的拒絕： ${ err }`.red);
        client.console('Error', undefined, undefined, undefined, promise);
    })
    .on('exit', async (code) => {
        //
        console.log(`[#${client.shard.ids}]  關機｜退出代碼: ${ code }`);
    });


// start the web (如果分片編號是0)
if (client.shard.ids == 0
    && config.web.noWeb != 'true') {
    require('./web')(client);
}
