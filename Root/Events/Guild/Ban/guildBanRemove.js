const moment = require('moment');
const { GuildBan, Client } = require('discord.js');
const { log } = require('./../../../Utils/log');

module.exports = {
    name: 'guildBanRemove',
    /**
     *
     * @param {GuildBan} ban
     * @param {Client} client
     * @param {*} container
     */
    run: async (ban, client, container) => {
        log(
            'info',
            `UNBAN ｜ ${ban.guild.name} (${ban.guild.id}) 解除封鎖 ${ban.user.tag} (${ban.user.id})`,
            true,
            client);
    },
};