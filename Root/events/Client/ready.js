const { Events, ActivityType } = require('discord.js');
require("colors");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {*} _c
     */
    async execute(client, _c) {
        client.user.setPresence({ activities: [{ name: `${client.user.username} 暫停服務`, type: ActivityType.Watching }], status: 'dnd' });
        client.console.log(`[準備] ${ client.user.tag } 完成登入！`.brightGreen);

        // 機器人狀態張貼到伺服器上
        if (client.guilds.cache.get(client.config.guild.ServerID)) {
            require('./bot/status')(client);
        }
    },
};
