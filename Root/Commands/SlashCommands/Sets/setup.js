const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const config = require('./../../../../Config');
const db = require('quick.db');


module.exports = {
    command: {
        name: 'setup',
        description: '設定',
        options: [
            // #region chat-bot
            {
                type: 1,
                name: 'chat-bot',
                description: '設定一個聊天機器人頻道',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '指向的頻道',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region cross-servers
            {
                type: 1,
                name: 'corss-servers',
                description: '設定跨群聊天頻道',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '指向的頻道',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region suggestions-channel
            {
                type: 1,
                name: 'suggestions-channel',
                description: '設定提議/建議頻道',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '指向的頻道',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region suggestions-channel
            {
                type: 1,
                name: 'counting',
                description: '設定數數頻道',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '指向的頻道',
                        required: false,
                    },
                    {
                        type: 5,
                        name: 'wrong_reset',
                        description: '如果有人數數錯誤，是否重製? (預設為是)',
                        required: false,
                    },
                    {
                        type: 5,
                        name: 'no_twice',
                        description: '是否禁止有人連續數數? (預設為是)',
                        required: false,
                    },
                ],
            },
            // #endregion
        ],
    },
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
    userPermissions: ['MANAGE_GUILD'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 取得子指令
        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // #region chat_bot
        if (subcommand == 'chat-bot') {
            const db_data = `data.discord.guilds.${interaction.guild.id}.channel.plugins.chatbot.channel`;
            await db.set(db_data, channel.id);
        }
        // #endregion
        // #region suggestions-channel
        else if (subcommand == 'suggestions-channel') {
            interaction.deferReply();
            const reset = `data.discord.guilds.${interaction.guild.id}.channel.plugins.suggestions_data`;
            await db.delete(reset);
            // set
            const db_data = `data.discord.guilds.${interaction.guild.id}.channel.plugins.suggestions_data.channel`;
            await db.set(db_data, channel.id);
        }
        // #endregion
        // #region counting
        else if (subcommand == 'counting') {
            interaction.deferReply();
            const db_path = `data.discord.guilds.${interaction.guild.id}.channel.plugins.count_data`;
            db.delete(db_path);
            const data = {
                // 控制選項
                channel: channel.id,
                WrongReset: interaction.options.getBoolean('wrong_reset') || true,
                noTwice: interaction.options.getBoolean('no_twice') || true,
            };
            await db.set(db_path, data);
        }
        // #endregion
        // else
        else return interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        }).catch((err) => { });


        interaction.reply({
            content: `${subcommand} 的頻道成功指向 <#${channel.id}> ，去試試看?`,
        })
            .catch((err) => {
                interaction.editReply({
                    content: `${subcommand} 的頻道成功指向 <#${channel.id}>，去試試看?`,
                });
            });
        try {
            channel.sendTyping();
            channel.send({ content: `這裡！ <@${interaction.user.id}>` });
        } catch (error) {
            //
        }


        // 執行
    },
};
