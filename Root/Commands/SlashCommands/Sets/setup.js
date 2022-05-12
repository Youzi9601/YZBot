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


module.exports = {
    command: {
        name: 'setup',
        description: '設定',
        options: [
            // #region chat-bot
            {
                type: 1,
                name: 'chat-bot',
                description: '設定一個聊天機器人！',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '頻道',
                        required: true,
                    },
                ],
            },
            // #endregion
            // #region say
            {
                type: 1,
                name: 'corss-servers',
                description: '設定跨群聊天',
                options: [
                    {
                        type: 7,
                        name: 'channel',
                        description: '跨群的頻道',
                        required: false,
                    },
                ],
            },
            // #endregion
        ],
    },
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    userPermissions: ['ADMINISTRATOR'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 取得子指令
        const subcommand = interaction.options.getSubcommand();
        interaction.editReply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
        return;

        // 執行
        // #region chat_bot
        // #endregion
    },
};
