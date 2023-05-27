const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildCreate,
    /**
     *
     * @param {import('./../../bot').client} client
     * @param {import('discord.js').Guild} guild
     * @returns
     */
    async execute(client, guild) {
        client.console('Log', `+伺服器 > ${guild.name} (${guild.id})`);
    },
};