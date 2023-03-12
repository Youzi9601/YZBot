const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildCreate,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Guild} guild
     * @returns
     */
    async execute(client, guild) {
        client.console.log(`+伺服器 > ${guild.name} (${guild.id})`);
    },
};