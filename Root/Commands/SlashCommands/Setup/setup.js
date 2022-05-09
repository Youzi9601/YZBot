const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const config = require('../../../../Config.js');

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
                name: 'say',
                description: '說出訊息(包含嵌入訊息)',
                options: [
                    {
                        type: 3,
                        name: 'contents',
                        description: '純文字',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'title',
                        description: '標題',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'description',
                        description: '內文',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'color',
                        description:
                            '顏色 | 白FFFFFF、黑000000、紅FF0000、綠00FF00、藍0000FF',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'title_url',
                        description: '超連結(限定 http(s):// )',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'author_name',
                        description: '作者',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'author_icon',
                        description: '圖標(限定 http(s):// )',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'author_url',
                        description: '超連結(限定 http(s):// )',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'thumbnail',
                        description: '圖片(右側)',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'image',
                        description: '圖片(下方)',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'fields',
                        description:
                            '使用json文本創建 | {name:標題,value: 內容,inline:true},',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'timestamp',
                        description: '啟用時間? (預設為否)',
                        required: false,
                        choices: [
                            {
                                name: 'True',
                                value: 'true',
                            },
                            {
                                name: 'False',
                                value: 'false',
                            },
                        ],
                    },
                    {
                        type: 3,
                        name: 'footer_text',
                        description: '底部文字',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'footer_icon',
                        description: '底部文字的頭像',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'reply_id',
                        description: '回覆的訊息ID',
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
        // 執行
        // #region chat_bot
        // #endregion
    },
};
