/**
 * 				const message = guildData.plugins.welcome.message
					.replace(/{user}/g, member)
					.replace(/{server}/g, member.guild.name)
					.replace(/{membercount}/g, member.guild.memberCount)
 */
const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../Config.js');
const moment = require('moment');
const db = require('quick.db');
/**
 *
 */
module.exports = {
    name: 'guildMemberAdd',
    /**
	 *
	 * @param {guildMemberAdd} member
	 * @param {Client} client
	 */
    run: async (member, client, container) => {
        const guildData = await client.findOrCreateGuild({ id: member.guild.id });
        member.guild.data = guildData;

        console.log(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 新的成員加入： ${member.tag}`);

    },
};