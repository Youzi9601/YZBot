const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder, ChannelType } = require("discord.js");
/**
 *
 * @param {SlashCommandSubcommandBuilder} c 基本通用的訊息處理器
 */
function msg_options(c) {
    return c
        .addStringOption(s =>
            s
                .setName('contents')
                .setDescription('純文字')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('title')
                .setDescription('標題')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('title_url')
                .setDescription('超連結(限定 http(s):// )')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('description')
                .setDescription('內文')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('color')
                .setDescription('顏色 | 白FFFFFF、黑000000、紅FF0000、綠00FF00、藍0000FF')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('author_name')
                .setDescription('作者')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('author_icon')
                .setDescription('圖標(限定 http(s):// )')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('author_url')
                .setDescription('超連結(限定 http(s):// )')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('thumbnail')
                .setDescription('圖片(右側)，使用超連結(限定 http(s):// )')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('image')
                .setDescription('圖片(下方)，使用超連結(限定 http(s):// )')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('fields')
                .setDescription('以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('timestamp')
                .setDescription('啟用時間? (預設為否)')
                .setRequired(false)
                .setChoices(
                    {
                        name: 'True',
                        name_localizations: {
                            'zh-TW': '是',
                        },
                        value: 'true',

                    },
                    {
                        name: 'False',
                        name_localizations: {
                            'zh-TW': '否',
                        },
                        value: 'false',
                    },
                ),
        )
        .addStringOption(s =>
            s
                .setName('footer_text')
                .setDescription('底部文字')
                .setRequired(false),
        )
        .addStringOption(s =>
            s
                .setName('footer_icon')
                .setDescription('底部頭像')
                .setRequired(false),
        );
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('機器人控制系列')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator,
        )
        .addSubcommandGroup(g =>
            g
                .setName('webhook')
                .setDescription('Webhook 系列')
                .addSubcommand(c =>
                    Object.assign(
                        c
                            .setName('send')
                            .setDescription('以 Webhook 發送訊息')
                            .addStringOption(s =>
                                s
                                    .setName('name')
                                    .setDescription('名稱')
                                    .setRequired(false),
                            )
                            .addStringOption(s =>
                                s
                                    .setName('avatar')
                                    .setDescription('頭像(限用http(s)://)')
                                    .setRequired(false),
                            ),
                        msg_options(c),
                    ),
                )
                .addSubcommand(c =>
                    Object.assign(
                        c
                            .setName('clone-member')
                            .setDescription('以 Webhook 假裝為成員來「惡搞」的訊息')
                            .addUserOption(u =>
                                u
                                    .setName('member')
                                    .setDescription('要被複製的成員')
                                    .setRequired(true),
                            ),
                        msg_options(c),
                    ),
                )
                .addSubcommand(c =>
                    Object.assign(
                        c
                            .setName('edit')
                            .setDescription('編輯所發送的 Webhook 訊息')
                            .addStringOption(s =>
                                s
                                    .setName('id')
                                    .setDescription('訊息的ID')
                                    .setRequired(true),
                            ),
                        msg_options(c),
                    ),
                ),
        )
        .addSubcommandGroup(g =>
            g
                .setName('chat')
                .setDescription('機器人聊天 系列')
                .addSubcommand(c =>
                    Object.assign(
                        c
                            .setName('send')
                            .setDescription('以機器人發送訊息'),
                        msg_options(c),
                    ),
                )
                .addSubcommand(c =>
                    Object.assign(
                        c
                            .setName('edit')
                            .setDescription('編輯所發送的訊息')
                            .addStringOption(s =>
                                s
                                    .setName('id')
                                    .setDescription('訊息的ID')
                                    .setRequired(true),
                            ),
                        msg_options(c),
                    ),
                ),
        )
        .setDMPermission(false)
        .toJSON(),
    clientPermissions: [], // 待設定機器人的權限
    userPermissions:['Administrator'],
    OnlyRunOnGuilds: true,
    disabled: true, // 是否不使用此檔案
    type: ['Control'],
    cooldown: 5000,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        // 執行的內容
        // const subcommandGroup = interaction.options.getSubcommandGroup();
        // const subcommand = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });
        return await interaction.editReply({
            content:'❌ 尚未完成',
            ephemeral: true,
        });
    },
};

