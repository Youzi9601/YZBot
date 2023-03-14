const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildDelete,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Guild} guild
     * @returns
     */
    async execute(client, guild) {
        client.console('Log', `-伺服器 > ${guild.name} (${guild.id})`);
    },
};