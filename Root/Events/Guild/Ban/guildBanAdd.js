const moment = require('moment');
const { GuildBan, Client } = require('discord.js');
const { log } = require('./../../../Utils/log');

module.exports = {
    name: 'guildBanAdd',
    /**
     *
     * @param {GuildBan} ban
     * @param {Client} client
     * @param {*} container
     */
    run: async (ban, client, container) => {
        log(
            'info',
            ` BAN ｜ ${ban.guild.name} (${ban.guild.id}) 新增封鎖 ${ban.user.tag} (${ban.user.id})`,
            true,
            client);
    },
};