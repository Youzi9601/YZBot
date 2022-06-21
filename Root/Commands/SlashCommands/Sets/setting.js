const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const { config } = require('./../../../../bot');
const db = require('quick.db');

module.exports = {
    command: {
        name: 'setting',
        description: '機器人設定',
        options: [
            // #region guild
            {
                type: 2,
                name: 'guild',
                description: '設定整個伺服器',
                options: [
                    // #region welcome
                    {
                        type: 1,
                        name: 'welcome_msg',
                        description: '設定伺服器歡迎訊息',
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
                                type: 7,
                                name: 'channel',
                                description: '頻道位置',
                                required: false,
                            },
                        ],
                    },
                    // #endregion
                    // #region leave
                    {
                        type: 1,
                        name: 'leave_msg',
                        description: '設定伺服器離開訊息',
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
                                type: 7,
                                name: 'channel',
                                description: '頻道位置',
                                required: false,
                            },
                        ],
                    },
                    // #endregion
                    // #region logger
                    {
                        type: 1,
                        name: 'bot-logger',
                        description: '設定機器人使用日誌輸出頻道',
                        options: [
                            {
                                type: 7,
                                name: 'channel',
                                description: '頻道位置',
                                required: false,
                            },
                        ],
                    },
                    // #endregion
                    //#region button-role
                    {
                        type: 1,
                        name: 'button-role',
                        description: '新增按鈕給予身分組',
                        options: [
                            /*
                            {
                                type: 3,
                                name: 'contents',
                                description: '純文字',
                                required: false,
                            },
                            */
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
                                type: 7,
                                name: 'channel',
                                description: '頻道位置',
                                required: false,
                            },
                        ],
                    },
                    //#endregion button-role
                ],
            },
            // #endregion
            // #region channel
            {
                type: 2,
                name: 'channel',
                description: '設定這個頻道',
                options: [
                    {
                        type: 1,
                        name: 'other',
                        description: '其他設定',
                        options: [],
                    }],
            },
            // #endregion
        ],
    },
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    userPermissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 取得子指令
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        if (subcommandGroup == 'guild') {
            if (subcommand == 'bot-logger') {
                await interaction.deferReply();
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                // 傳輸Discord
                var logger_system = new db.table('logger_system');
                // 取得頻道之伺服器
                logger_system.set(`${ interaction.guild.id }`, channel.id);
                await interaction.editReply('完成設定！');
            }
            //
            else if (subcommand == '?welcome_msg') {

            }
            // 未完成
            else await interaction.reply({
                content: '此功能尚未完成！ :/',
                ephemeral: true,
            });
        }
        // 未完成
        else await interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
        return;

        // 執行
        // #region chat_bot
        // #endregion
    },
};
