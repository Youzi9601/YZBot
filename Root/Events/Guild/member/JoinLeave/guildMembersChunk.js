const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('./../../../../../bot');
const moment = require('moment');
const db = require('quick.db');
const { GuildMember, Client } = require('discord.js');
const { log } = require('../../../../Utils/log');
/**
 *
 */
module.exports = {
    name: 'guildMembersChunk',
    /**
     * @description 一個事件
     * @deprecated
     * @param {data: { count: number; index: number; nonce: string | undefined }} members
     * @param {import('discord.js').Guild} guild 機器人
     * @param {import('discord.js').Client} client 機器人
     */
    run: async (members, guild, client, container) => {
        log(
            'info',
            `大量新成員加入 ${guild.name}： ${JSON.stringify(members, null, 2)}`,
            true,
            client);
        console.assert(members);
    },
};