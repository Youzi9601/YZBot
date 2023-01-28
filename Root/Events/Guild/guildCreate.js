const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('../../../bot');
const moment = require('moment');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { log } = require('./../../Utils/log');
module.exports = {
    name: 'guildCreate',
    once: false,
    /**
     *
     * @param {import('discord.js').Guild} guild
     * @param {import('discord.js').Client} client
     * @param {*} container
     * @returns
     */
    run: async (guild, client, container) => {
        const owner = await guild.fetchOwner();
        const discordmsg = {
            embeds: [{
                description: `進退變動 > 加入 ${guild.name} (${guild.id}) (擁有者： ${owner.user.tag} ${guild.ownerId})`,
                color: 0x808080,
            }],
        };
        log(
            'info',
            chalk.green('進退變動 > ') + `加入 ${guild.name} (${guild.id}) (擁有者： ${owner.user.tag} ${guild.ownerId})`,
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
        /** 設定加入訊息 Home*/
        const invitemsg_embed = new MessageEmbed()
            .setColor(0xe4fff6)
            .setTitle(`${config.botName}`)
            .setDescription(`感謝您邀請${config.botName}到您的伺服器`)
            .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: '使用 [ / ] 呼叫斜線指令',
                    value: '或使用 `/help` 獲取機器人的指令列表',
                },
                {
                    name: '如果有任何問題',
                    value: `您可以到 [支援伺服器](https://discord.gg/${config.invite_code}) 來找我們喔！`,
                },
            )
            .setFooter({
                text: `${config.botName}`,
                iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
            });
        const invitemsg_button = new MessageButton()
            .setLabel('加入伺服器')
            .setStyle('LINK')
            .setURL(`https://discord.gg/${config.invite_code}`)
            .setDisabled(false);

        // 合併Components
        const row = new MessageActionRow().addComponents(invitemsg_button);
        /** 設定加入訊息 End*/
        let invite_channel = guild.systemChannel;

        if (guild.systemChannel) {
            invite_channel = guild.systemChannel;
        } else if (guild.rulesChannel) {
            invite_channel = guild.rulesChannel;
        } else {
            invite_channel = guild.channels.cache.filter(c => c.type == 'GUILD_TEXT' && c.nsfw == false && c.permissionsFor(client.user.id).has('SEND_MESSAGES') || c.type == 'GUILD_TEXT' && c.name.includes('聊天' || '說話') && c.permissionsFor(client.user.id).has('SEND_MESSAGES'))[0];
        }

        try {

            // invite_channel.sendTyping();
            await invite_channel.send({
                embeds: [invitemsg_embed],
                components: [row],
            });
        } catch (error) {
            log('ERROR', error, true, client);
        }

        invitechannel.send(
            '```diff' +
            `\n+ 機器人加入 ${guild.name} (${guild.id}) (擁有者： ${owner.user.tag} ${guild.ownerId}) ` +
            '\n```',
        );


    },
};
