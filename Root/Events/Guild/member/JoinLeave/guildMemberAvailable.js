const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('./../../../../../bot');
const moment = require('moment');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { GuildMember, Client } = require('discord.js');
const { log } = require('./../../../../Utils/log');
/**
 *
 */
module.exports = {
	name: 'guildMemberAvailable',
	/**
     *
     * @param {GuildMember} member
     * @param {import('discord.js').Client} client 機器人
     */
	async run(member, client, container) {
		const guild = member.guild;
		log(
			'info',
			`新成員加入社群 ${ guild.name }： ${ member.user.tag }`,
			true,
			client);
	},
};