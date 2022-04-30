/**
 * 				const message = guildData.plugins.welcome.message
                    .replace(/{user}/g, member)
                    .replace(/{server}/g, member.guild.name)
                    .replace(/{membercount}/g, member.guild.memberCount)
 */
const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const db = require('quick.db');
const { GuildMember, Client } = require('discord.js')
/**
 *
 */
module.exports = {
    name: 'guildMemberAdd',
    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     */
    run: async (member, client, container) => {
        const guild = client.guilds.cache(`${member.guild.id}`)

        console.log(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 新的成員加入 ${guild.name}： ${member.user.tag}`);

    },
};