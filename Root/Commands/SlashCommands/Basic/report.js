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
        name: 'report',
        description: '報告',
        options: [
            // #region bug
            {
                type: 1,
                name: 'bug',
                description: '回報錯誤',
                options: [
                    {
                        type: 3,
                        name: 'what_happen',
                        description: '請說明使用的當下所發生的狀況',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'message_link',
                        description: '訊息的連結',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region user
            {
                type: 1,
                name: 'user',
                description: '檢舉成員',
                options: [
                    {
                        type: 3,
                        name: 'user',
                        description: '被檢舉人',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'reason',
                        description: '檢舉的原因',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'message_link',
                        description: '證明(可為照片或是訊息連結)',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region other
            /*
            {
                type: 1,
                name: 'other',
                description: '其他報告',
                options: [
                    {
                        type: 3,
                        name: 'title',
                        description: '標題',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'reason',
                        description: '報告的原因',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'message_link',
                        description: '其他相關連結',
                        required: false,
                    },
                ],
            },
            */
            // #endregion
        ],
    },
    clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    userPermissions: ['SEND_MESSAGES'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 內容
        const subcommand = interaction.options.getSubcommand();
        /*
        interaction.deferReply({
            ephemeral: true,
        });
        */
        // bug
        if (subcommand == 'bug') {

            const reportChannel = client.channels.cache.get(
                config.Channels.report,
            );
            const what_happen = interaction.options.getString('what_happen').replace(/\\n/g, '\n');
            const message_link = (interaction.options.getString('message_link') || '無').replace(/\\n/g, '\n') || undefined;
            const report_embed = new MessageEmbed()
                .setColor('0x808080')
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                    icon: `${interaction.member.avatarURL({ dynamic: true })}`,
                })
                .setTitle('有新的問題回報錯誤！')
                .setDescription(`${what_happen}${message_link ? `\n[連結](${message_link})` : ''}`);
            reportChannel.send({ embeds: [report_embed] });
            interaction.reply({
                content: '已回報錯誤！感謝您的回報讓我們可以更好！',
            });
            const report_info = new MessageEmbed()
                .setColor('0x808080')
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                    icon: `${interaction.member.avatarURL({ dynamic: true })}`,
                })
                .setTitle('回報錯誤副本')
                .setDescription(`${what_happen}${message_link ? `\n[連結](${message_link})` : ''}`);
            try {
                // 嘗試DM成員
                interaction.member.user.send({ embeds: [report_info] });
            } finally {
                // 無
            }
        }
        // user
        else if (subcommand == 'user') {

            const reportChannel = client.channels.cache.get(
                config.Channels.report,
            );
            const user = interaction.options.getString('user').replace(/\\n/g, '\n');
            const reason = interaction.options.getString('reason').replace(/\\n/g, '\n') || '無';
            const message_link = (interaction.options.getString('message_link') || '無').replace(/\\n/g, '\n') || undefined;

            const report_embed = new MessageEmbed()
                .setColor('0x808080')
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                    icon: `${interaction.member.avatarURL({ dynamic: true })}`,
                })
                .setTitle('有新的舉報訊息！')
                .setDescription(`被檢舉者：${user}\n原因：${reason}${message_link ? `\n[連結](${message_link})` : ''}`);
            reportChannel.send({ embeds: [report_embed] });
            interaction.reply({
                content: '已回報錯誤！感謝您的回報讓我們可以更好！',
            });
            const report_info = new MessageEmbed()
                .setColor('0x808080')
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                    icon: `${interaction.member.avatarURL({ dynamic: true })}`,
                })
                .setTitle('檢舉成員副本')
                .setDescription(`被檢舉者：${user}\n原因：${reason}${message_link ? `\n[連結](${message_link})` : ''}`);
            try {
                // 嘗試DM成員
                interaction.member.user.send({ embeds: [report_info] });
            } finally {
                // 無
            }

        }
        // other
        else if (subcommand == 'other') {
            interaction.reply({
                content: '此功能尚未完成！ :/',
            });

        }
    },
};