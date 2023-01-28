const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const { config } = require('../../../../bot');
module.exports = {
    command: {
        name: 'invite',
        description: '邀請機器人',
    },
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    cooldown: 5000,
    /**
   *
   * @param {import('discord.js').Client} client 機器人
   * @param {CommandInteraction} interaction
   * @param {*} container
   */
    run: async (client, interaction, container) => {
        const invitemsg_embed = new MessageEmbed()
            .setColor(0xe4fff6)
            .setTitle(`${config.botName}`)
            .setDescription(`感謝您邀請${config.botName}到您的伺服器`)
            .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: '使用 [ / ] 呼叫斜線指令',
                    value: '或使用 `/help` 獲取機器人的指令列表',
                    inline: true,
                },
                {
                    name: '投票給與我們最大的支持！',
                    value: `[這裡！](https://discordservers.tw/bots/${client.user.id}) 前往投票網站！`,
                    inline: true,
                },
                {
                    name: '如果有任何問題',
                    value: `您可以到 [支援伺服器](https://discord.gg/${config.invite_code}) 來找我們喔！`,
                    inline: true,
                },
            )
            .setFooter({
                text: `${config.botName}`,
                iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
            });
        const invitemsg_button = new MessageButton()
            .setLabel('加入伺服器')
            .setStyle('LINK')
            .setURL(`https://discord.gg/${config.invite_code}`)
            .setDisabled(false);

        const invitebot_button = new MessageButton()
            .setLabel('邀請機器人')
            .setStyle('LINK')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=8&scope=bot%20applications.commands`);


        // 合併Components
        const row = new MessageActionRow().addComponents(invitemsg_button)
            .addComponents(invitebot_button);
        /** 設定加入訊息 End*/


        interaction.reply({
            embeds: [invitemsg_embed],
            components: [row],
        });
    },
};
