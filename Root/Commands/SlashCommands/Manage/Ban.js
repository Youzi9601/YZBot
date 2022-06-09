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
        name: 'ban',
        description: '從伺服器封鎖指定的成員',
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
        default_member_permissions: ['BAN_MEMBERS'],
    },
    cooldown: 10000,
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
    run: async (client, interaction, container) => {
        // 內容

        const user = interaction.options.getMember('user');
        if (user.permissions.has('BAN_MEMBERS')) {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('🛑 您不能封鎖一個含有封鎖成員權限的成員。');
            interaction.reply({ embeds: [msg] });
        } else {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('✅ 已從伺服器封鎖該用戶！');
            interaction.guild.members.ban(user, { reason });
            interaction.reply({ embeds: [msg] });
        }
    },
};
