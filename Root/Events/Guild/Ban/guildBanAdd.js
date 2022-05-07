const moment = require('moment');
const { Guild, User, Client } = require('discord.js');
const { log } = require('./../../../Utils/log')

module.exports = {
    name: 'guildBanAdd',
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
            ` BAN ｜ ${guild.name} 新增封鎖 ${user.tag}(${user.id})`,
            true,
            client)
    },
};