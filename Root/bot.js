const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../Config');
require("colors");

const CI = process.env.CI;
if (CI) {
    console.log(`[#${client.shard.ids}]  [#${client.shard.ids}] ` + 'CI檢查完畢');
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
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
});


// Getting the bot token:
const AuthenticationToken = process.env.token || config.bot.token;
if (!AuthenticationToken) {
    console.warn(`` + "[CRASH] 需要 Discord 機器人的身份驗證令牌！使用 Envrionment Secrets 或 config.js。".red);
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

client.config = config;
// 語言設定
client.language = new Collection();
/**
 * 語言檔案設定與取得
 * @param {'zh_TW'} locale 語言
 * @param {} file 檔案
 * @returns langs
 */
client.language_data = (locale, file) => {
    return client.language.get(locale + '/' + file) || client.language.get('zh-TW' + '/' + file);
};


module.exports = client;

["prefix", "application_commands", "modals", "events", "database", "languages_loader"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
    .catch((err) => {
        console.error(`[#${client.shard.ids}]  ` + "[CRASH] 連接到您的機器人時出了點問題...");
        console.error(`[#${client.shard.ids}]  ` + "[CRASH] 來自 Discord API 的錯誤：" + err);
        return process.exit();
    });

// Handle errors:
process
    .on('unhandledRejection', async (err, promise) => {
        console.error(`[#${client.shard.ids}]  ` + `[ANTI-CRASH] 未處理的拒絕： ${ err }`.red);
        console.error(promise);
    })
    .on('uncaughtException', async (err, promise) => {
        console.error(`[#${client.shard.ids}]  ` + `[ANTI-CRASH] 未處理的拒絕： ${ err }`.red);
        console.error(promise);
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
