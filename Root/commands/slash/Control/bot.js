const { Colors, SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

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
                                    .setName('message_id')
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
                            .setDescription('以機器人發送訊息')
                            .addStringOption(id =>
                                id
                                    .setName('reply_id')
                                    .setDescription('機器人所回覆的訊息ID')
                                    .setRequired(false),
                            ),
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
                                    .setName('message_id')
                                    .setDescription('訊息的ID')
                                    .setRequired(true),
                            ),
                        msg_options(c),
                    ),
                ),
        )
        .setDMPermission(false)
        .toJSON(),
    clientPermissions: ["ReadMessageHistory", "ViewChannel", "SendMessages", "ManageWebhooks"], // 待設定機器人的權限
    userPermissions:['Administrator'],
    OnlyRunOnGuilds: true,
    disabled: false, // 是否不使用此檔案
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
        await interaction.deferReply({ ephemeral: true });
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        let msg;
        let channel = interaction.channel;
        // 判斷是否會需要用到結構產生器
        if (
            subcommand == 'send'
            || subcommand == 'edit'
            || subcommand == 'clone-member'
        ) {
            msg = msg_builder(client, interaction);
            channel = interaction.guild.channels.cache.get(
                interaction.options.getString('channel_id'),
            ) || interaction.channel;
        }


        if (subcommandGroup == 'webhook') {
            // 尋找 Webhook 於該頻道
            const webhooks = await channel.fetchWebhooks();
            let webhook = webhooks.find(wh => wh.token);
            if (!webhook) {
                webhook = await interaction.channel.createWebhook({
                    name:`${ client.user.username + ' - Webhook系統' }`.replace(/discord/g, 'DC'),
                    avatar:
                            client.user.displayAvatarURL()
                            || client.user.defaultAvatarURL,
                });
            }

            // 執行命令
            if (subcommand == 'send') {
                const username = interaction.options.getString('name') || client.user.username;
                const avatar = interaction.options.getString('avatar') || client.user.avatarURL({ dynamic: true }) || client.user.defaultAvatarURL;
                try {
                    await webhook.send({
                        username: username,
                        avatarURL: avatar,
                        content: msg.content,
                        embeds: msg.embeds,
                    });
                } catch (error) {
                    return await interaction.editReply(`:x: 發生了錯誤：\`\`\`js\n${ error }\`\`\``);
                }
                await interaction.editReply('成功發送！');

            } else if (subcommand == 'edit') {
                const message_id = interaction.options.getString('message_id');
                try {
                    await webhook.editMessage(message_id, {
                        content: msg.content,
                        embeds: msg.embeds,
                    });
                } catch (error) {
                    return await interaction.editReply(`:x: 發生了錯誤：\`\`\`js\n${ error }\`\`\``);
                }
                await interaction.editReply('成功編輯！');

            } else if (subcommand == 'clone-member') {
                const user = interaction.options.getMember('member');
                const username = user.nickname || user.user.username;
                const avatar = user.displayAvatarURL({ dynamic: true }) || user.user.defaultAvatarURL;
                try {
                    await webhook.send({
                        username: username,
                        avatarURL: avatar,
                        content: msg.content,
                        embeds: msg.embeds,
                    });
                } catch (error) {
                    return await interaction.editReply(`:x: 發生了錯誤：\`\`\`js\n${ error }\`\`\``);
                }
                await interaction.editReply('成功發送！');
            }

        } else if (subcommandGroup == 'chat') {
            //
            if (subcommand == 'send') {
                const reply_id = interaction.options.getString('reply_id');
                if (reply_id)
                    channel.messages.fetch({ around: reply_id, limit: 1 })
                        .then(message => {
                            const fetchedMsg = message.first();
                            fetchedMsg.reply(msg);
                            interaction.editReply({
                                content: '已經成功編輯指定訊息',
                            });
                        }).catch((error) => {
                            console.error(error);
                            interaction.editReply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${ reply_id } 的訊息 ...` });
                            return;
                        });

                else
                    try {
                        await channel.send(msg);
                    } catch (error) {
                        console.error(error);
                        await interaction.editReply({ content: `啊喔...發生了錯誤：無法發送訊息...\n\`\`\`js\n${ error }\`\`\`` });
                        return;
                    }
                await interaction.editReply({
                    content: '已經成功發送指定訊息',
                });

            } else if (subcommand == 'edit') {
                channel.messages.fetch({ around: interaction.options.getString('message_id'), limit: 1 })
                    .then(message => {
                        const fetchedMsg = message.first();
                        fetchedMsg.edit(msg);
                        // console.info(msg);
                        // console.info(fetchedMsg.content);
                        interaction.editReply({
                            content: '已經成功編輯指定訊息',
                            ephemeral: true,
                        });
                    }).catch((error) => {
                        console.error(error);
                        interaction.editReply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${ interaction.options.getString('message_id') } 的訊息 ...` });
                        return;
                    });
            }

        } else return await interaction.editReply({
            content:'❌ 尚未完成的命令',
            ephemeral: true,
        });
    },
    /**
     *
     * @param {*} client
     * @param {import('discord.js').AutocompleteInteraction} interaction
     * @param {*} config
     * @param {*} db
     */
    autocomplete: async (client, interaction, config, db) => {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === 'color') {
            choices = [
                { name: "Default", value: "0x000000" },
                { name: "White", value: "0xffffff" },
                { name: "Aqua", value: "0x1abc9c" },
                { name: "Green", value: "0x57f287" },
                { name: "Blue", value: "0x3498db" },
                { name: "Yellow", value: "0xfee75c" },
                { name: "Purple", value: "0x9b59b6" },
                { name: "LuminousVividPink", value: "0xe91e63" },
                { name: "Fuchsia", value: "0xeb459e" },
                { name: "Gold", value: "0xf1c40f" },
                { name: "Orange", value: "0xe67e22" },
                { name: "Red", value: "0xed4245" },
                { name: "Grey", value: "0x95a5a6" },
                { name: "Navy", value: "0x34495e" },
                { name: "DarkAqua", value: "0x11806a" },
                { name: "DarkGreen", value: "0x1f8b4c" },
                { name: "DarkBlue", value: "0x206694" },
                { name: "DarkPurple", value: "0x71368a" },
                { name: "DarkVividPink", value: "0xad1457" },
                { name: "DarkGold", value: "0xc27c0e" },
                { name: "DarkOrange", value: "0xa84300" },
                { name: "DarkRed", value: "0x992d22" },
                { name: "DarkGrey", value: "0x979c9f" },
                { name: "DarkerGrey", value: "0x7f8c8d" },
                { name: "LightGrey", value: "0xbcc0c0" },
                { name: "DarkNavy", value: "0x2c3e50" },
                { name: "Blurple", value: '0x5865f2' },
                { name: "Greyple", value: "0x99aab5" },
                { name: "DarkButNotBlack", value: "0x2c2f33" },
                { name: "NotQuiteBlack", value: "0x23272a" },
                { name: "Random", value: "Random" },
            ];
        }

        let filtered = choices.filter(c => c.name.startsWith(focusedOption.value));
        if (filtered.length > 25) {
            filtered = filtered.slice(0, 24).concat([{ name: "還有更多...", value: "more" }]);
        }
        await interaction.respond(
            filtered.map(choice => ({ name: `${choice.name}`, value: `${choice.value}` })),
        );
    },
};


/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @returns {Object}
 */
function msg_builder(client, interaction) {
    const content = interaction.options.getString('contents') || undefined;
    // #reguin EMBED
    const embed = new EmbedBuilder();
    // main
    const embed_title = interaction.options.getString('title') || undefined;
    if (embed_title) {
        embed.setTitle(embed_title.replace(/\\n/g, '\n'));
    }
    const embed_description = interaction.options.getString('description') || undefined;
    if (embed_description) {
        embed.setDescription(embed_description.replace(/\\n/g, '\n'));
    }
    const embed_title_url = interaction.options.getString('title_url') || undefined;
    if (embed_title_url) {
        embed.setURL(embed_title_url);
    }
    // author
    const embed_author_name = interaction.options.getString('author_name') || undefined;
    const embed_author_icon = interaction.options.getString('author_icon') || undefined;
    const embed_author_url = interaction.options.getString('author_url') || undefined;
    if (embed_author_name || embed_author_url || embed_author_icon) {
        if (embed_author_name) {
            embed.data.author.name = embed_author_name;
        }
        if (embed_author_icon) {
            embed.data.author.icon_url = embed_author_icon;
        }
        if (embed_author_url) {
            embed.data.author.url = embed_author_url;
        }
    }
    // thumbnail
    const embed_thumbnail = interaction.options.getString('thumbnail') || undefined;
    if (embed_thumbnail) {
        embed.data.thumbnail.url = embed_thumbnail;
    }
    // image
    const embed_image = interaction.options.getString('image') || undefined;
    if (embed_image) {
        embed.data.image.url = embed_image;
    }
    // footer

    const embed_footer_text = interaction.options.getString('footer_text') || undefined;
    const embed_footer_icon = interaction.options.getString('footer_icon') || undefined;
    if (embed_footer_icon || embed_footer_text) {
        if (embed_footer_text) {
            embed.data.footer.text = embed_footer_text;
        }
        if (embed_footer_icon) {
            embed.data.footer.icon_url = embed_footer_icon;
        }
    }
    // fields
    const embed_fields = interaction.options.getString('fields') || undefined;
    if (embed_fields) {
        // 分開每個部件
        const fields = embed_fields.split(';');
        const fields_return = [];
        // 整理每個部件的項目
        fields.forEach((field) => {
            const obj = field.split(',');
            fields_return.push({
                name: obj[0],
                value: obj[1],
                inline: obj[2] || false,
            });
        });
        embed.data.fields = [fields_return];
    }

    // 取得訊息內容
    const msg = {};
    if (content) {
        msg.content = content.replace(/\\n/g, '\n\u200b');
    }

    if (
        embed.data.title ||
        embed.data.description ||
        embed.data.footer ||
        embed.data.image ||
        embed.data.thumbnail ||
        embed.data.fields
    ) {
        // timestamp & color
        const embed_color = interaction.options.getString('color') || '0x000000';
        const colorNum = parseInt(embed_color);
        if (embed_color) {
            embed.setColor(isNaN(colorNum) ? embed_color : colorNum);
        }
        const embed_timestamp = interaction.options.getString('timestamp') || false;
        if (embed_timestamp == true) {
            embed.data.timestamp = new Date();
        } else {
            // 不新增
        }
        // 設定
        msg.embeds = [embed];
    }
    return msg;
}
/**
 * 機器人訊息格式：過多的重複結構，用於省略
 * @param {SlashCommandSubcommandBuilder} c 基本通用的訊息處理器
 * @returns {SlashCommandSubcommandBuilder}
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
                .setDescription('顏色 | 白#FFFFFF、黑#000000、紅#FF0000、綠#00FF00、藍#0000FF')
                .setRequired(false)
                .setAutocomplete(true),
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