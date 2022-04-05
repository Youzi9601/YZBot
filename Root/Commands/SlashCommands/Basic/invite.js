const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const config = require("../../../../Config")
module.exports = {
    name: 'invite',
    description: '邀請機器人',
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    cooldown: 5000,
    run: async (client, interaction, container) => {
        const invitemsg_embed = new MessageEmbed()
            .setColor(0xe4fff6)
            .setTitle(`${config.botName}`)
            .setDescription(`感謝您邀請${config.botName}到您的伺服器`)
            .setThumbnail(`${client.user.displayAvatarURL()}`)
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
                iconURL: `${client.user.displayAvatarURL()}`,
            });
        const invitemsg_button = new MessageButton()
            .setLabel('加入伺服器')
            .setStyle('LINK')
            .setURL(`https://discord.gg/${config.invite_code}`)
            .setDisabled(false);

        // 合併Components
        const row = new MessageActionRow().addComponents(invitemsg_button);
        /** 設定加入訊息 End*/


        interaction.reply({
            embeds: [invitemsg_embed],
            components: [row],
        });
    },
};
