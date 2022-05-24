const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('./../../../../../bot');
const moment = require('moment');
const db = require('quick.db');
const { GuildMember, Client } = require('discord.js');
const { log } = require('../../../../Utils/log');
const chunker = {};
/**
 *
 */
module.exports = {
    name: 'guildMembersChunk',
    /**
     * @description 一個事件
     * @deprecated
     * @param {import('discord.js').Collection <Snowflake, GuildMember>} members
     * @param {import('discord.js').Guild} guild 機器人
     * @param {import('discord.js').ClientEvents} chunk ClientEvents
     * //param {ClientEvents.guildMembersChunk[2]}
     * @param {import('discord.js').Client} client 機器人
     */
    run: async (members, guild, chunk, client, container) => {
        log(
            'error',
            `收到大量成員於 ${guild.name}： ${members.size}個成員取得`,
            true,
            client);
        log(
            'error',
            JSON.stringify(chunk, null, 2),
        );
        // chunk.guildMembersChunk[2].
        console.log(chunk);
    },
};

/*

 members:
  {
    "guildId": "849809683085525032",
    "joinedTimestamp": 1639583038302,
    "premiumSinceTimestamp": null,
    "nickname": null,
    "pending": false,
    "communicationDisabledUntilTimestamp": null,
    "userId": "888789998734815303",
    "avatar": null,
    "displayName": "oscarloll",
    "roles": [
      "849813503932891177",
      "857937153657012225",
      "849809683085525032"
    ],
    "avatarURL": null,
    "displayAvatarURL": "https://cdn.discordapp.com/embed/avatars/3.png"
  },
  {
    "guildId": "849809683085525032",
    "joinedTimestamp": 1629245512484,
    "premiumSinceTimestamp": null,
    "nickname": null,
    "pending": false,
    "communicationDisabledUntilTimestamp": null,
    "userId": "853080735661424640",
    "avatar": null,
    "displayName": "Lyz",
    "roles": [
      "849813503932891177",
      "857937153657012225",
      "849809683085525032"
    ],
    "avatarURL": null,
    "displayAvatarURL": "https://cdn.discordapp.com/avatars/853080735661424640/1834e023e80aa3e71bf205af7dad1d82.webp"
  },
 ...
]


*/