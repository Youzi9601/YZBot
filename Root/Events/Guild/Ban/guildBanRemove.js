const moment = require('moment');
const { Guild, User, Client } = require('discord.js');
const { log } = require('./../../../Utils/log');

module.exports = {
    name: 'guildBanRemove',
    /**
     *
     * @param {Guild} guild
     * @param {User} user
     * @param {Client} client
     * @param {*} container
     */
    run: async (guild, user, client) => {
        log(
            'info',
            `UNBAN ｜ ${guild.name} 解除封鎖 ${user.tag}(${user.id})`,
            true,
            client);
    },
};