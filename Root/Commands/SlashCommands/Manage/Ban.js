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
            {
                name: 'days',
                type: 'NUMBER',
                description: '封鎖的天數',
                required: false,
            },
            /* {
                name: 'delete-days',
                type: 'NUMBER',
                description: '刪除該成員訊息的天數',
                required: false,
            },*/
        ],
        default_member_permissions: ['BAN_MEMBERS'],
    },
    cooldown: 10000,
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        await interaction.deferReply();
        // 內容

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || '沒有原因';
        const days = interaction.options.getNumber('days') ? { days: interaction.options.getNumber('days') } : undefined;
        const ddays = interaction.options.getNumber('delete-days');
        if (user.permissions.has('BAN_MEMBERS')) {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('🛑 您不能封鎖一個含有封鎖成員權限的成員。');
            //
            await interaction.editReply({ embeds: [msg] });

        } else {

            const msg = new container.Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('✅ 已從伺服器封鎖該用戶！');
            await interaction.guild.members.ban(user, { reason: reason, days });
            //
            await interaction.editReply({ embeds: [msg] });
        }
    },
};
