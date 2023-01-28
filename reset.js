// 此檔案用於刪除所有命令！
(async () => {
    // const moment = require("moment");

    const Discord = require('discord.js');
    const config = require('./Config');
    const path = __dirname;
    const client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_PRESENCES,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_INVITES,
            Discord.Intents.FLAGS.GUILD_BANS,
        ],
        partials: ['CHANNEL'],
        // ws: { properties: { $browser: "Discord iOS" } }
    });
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');


    exports.client = client;
    exports.path = path;
    exports.config = config;
    /**
   *
   * 運轉
   * [${moment().format("YYYY-MM-DD HH:mm:ss")}] 為時間截
   */
    /**
   * 清除
   */
    const rest = new REST({ version: '9' }).setToken(config.token);
    const promises = await rest.get(Routes.applicationCommands(config.clientID)).then((data) => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(config.clientID)}/${command.id
            }`;
            promises.push(rest.delete(deleteUrl));
            console.info(deleteUrl);
        }
        return Promise.all(promises);
    });
    console.log('完成!' + promises.length + '個命令被刪除！');
    // console.log('準備開始運轉...')
    // 下載npm
    // const exec = require('child_process').exec;
    // await exec('npm run start');
})();
