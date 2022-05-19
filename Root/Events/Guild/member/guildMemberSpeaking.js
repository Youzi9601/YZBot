const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('./../../../../bot');
const moment = require('moment');
const db = require('quick.db');
const { GuildMember, Client } = require('discord.js');
const { log } = require('./../../../Utils/log');
/**
 *
 */
module.exports = {
    name: 'guildMemberSpeaking',
    /**
     *
     * @param {import('discord.js').GuildMember} member
     * @param {boolean} speaking 機器人
     * @param {import('discord.js').Client} client 機器人
     */
    run: async (member, speaking, client, container) => {
        log(
            'info',
            `${member.guild.name} - ${member.user.tag} ${speaking ? '開始' : '停止'}發言`,
            true,
            client);
    },
};