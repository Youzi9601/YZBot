const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('../../../bot');
const moment = require('moment');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'guildUnavailable',
    once: false,
    run: async (guild, client, container) => {
        const discordmsg = {
            embeds: [{
                description: `進退變動 > ${guild.name} 不可用`,
                color: 0x808080,
            }],
        };
        log(
            'info',
            chalk.green('進退變動 > ') + `${guild.name}不可用`,
            true,
            client,
            discordmsg);
        client.user.setPresence({
            activities: [
                {
                    name: `${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者`,
                },
            ],
            status: `${config.botPresence.status}`,
        });

        // console 頻道
        const invitechannel = client.channels.cache.get(
            config.Channels.inviteChannel,
        );
        // 進退變動 離開
        invitechannel.send('```diff' + `\n- 機器人已離開：${guild.name}` + '\n```');

        // end
    },
};
