const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const ms = require('ms');

module.exports = {
    command: {
        name: 'timeout',
        description: '從伺服器禁言指定的成員',
        options: [
            {
                name: 'user',
                type: 'USER',
                description: '指定的成員',
                required: true,
            },
            {
                name: 'duration',
                type: 'STRING',
                description: '時間長度 (日d 時h 分m 秒s，不需空格，有也是可以)',
                required: true,
            },
            {
                name: 'reason',
                type: 'STRING',
                description: '原因',
                required: false,
            },
        ],
        default_member_permissions: ['MODERATE_MEMBERS'],
    },
    cooldown: 10000,
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MODERATE_MEMBERS'],
    userPermissions: ['MODERATE_MEMBERS'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 內容

        const user = interaction.options.getMember('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || '沒有原因';
        if (user.permissions.has('MODERATE_MEMBERS')) {
            const msg = new container.Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('🛑 您不能禁言一個含有禁言成員權限的成員。');
            interaction.reply({ embeds: [msg] });
        } else {
            const clear_duration = duration
                .replace('年', 'y')
                .replace('天', 'd')
                .replace('日', 'd')
                .replace('小時', 'h')
                .replace('時', 'h')
                .replace('分鐘', 'm')
                .replace('分', 'm')
                .replace('秒鐘', 's')
                .replace('秒', 's');
            let ms_duration = Number;
            try {
                ms_duration = ms(clear_duration);
            } catch (error) {
                interaction.reply(`:x: umm... 我看不懂\`${duration}\`是甚麼... \n如果禁言時間為\`5天3小時10分鐘30秒\`，請輸入\`5d3h10m30s\``);
                return error;
            }

            const msg = new container.Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('✅ 已從伺服器禁言該用戶！');

            user.timeout(ms_duration, reason);
            interaction.reply({ embeds: [msg] });
        }
    },
};
