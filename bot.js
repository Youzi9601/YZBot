const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./Config');
const colors = require("colors");


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
    console.warn("[CRASH] 需要 Discord 機器人的身份驗證令牌！使用 Envrionment Secrets 或 config.js。".red)
    return process.exit();
}

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
    require(`./Root/handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
    .catch((err) => {
        console.error("[CRASH] 連接到您的機器人時出了點問題...");
        console.error("[CRASH] 來自 Discord API 的錯誤：" + err);
        return process.exit();
    });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
    console.error(`[ANTI-CRASH] 未處理的拒絕： ${err}`.red);
    console.error(promise);
});
