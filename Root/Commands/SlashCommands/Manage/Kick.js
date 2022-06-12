const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    command: {
        name: 'kick',
        description: '從伺服器踢出指定的成員',
        options: [
            {
                name: 'user',
                type: 'USER',
                description: '指定的成員',
                required: true,
            },
            {
                name: 'reason',
                type: 'STRING',
                description: '原因',
                required: false,
            },
        ],
        default_member_permissions: ['KICK_MEMBERS'],
    },
    cooldown: 10000,
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
    userPermissions: ['KICK_MEMBERS'],
    /**
  *
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').CommandInteraction} interaction
  * @param {*} container
  */
    run: async (client, interaction, container) => {
        // 內容

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || '沒有原因';
        if (user.permissions.has('KICK_MEMBERS')) {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('🛑 您不能踢出一個含有踢出成員權限的成員。');
            interaction.reply({ embeds: [msg] });
        } else {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('✅ 已從伺服器踢出該用戶！');
            interaction.guild.members.kick(user, reason);
            interaction.reply({ embeds: [msg] });
        }
    },
};
