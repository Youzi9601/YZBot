const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Interaction,
    //
    CommandInteraction,
    ReactionCollector,
} = require('discord.js');
const { config } = require('../../../../bot');
const { log } = require('./../../../Utils/log');

module.exports = {
    command: {
        name: 'bot',
        description: '用機器人的身分執行',
        options: [
            // #region reactions-create
            {
                type: 1,
                name: 'reactions-create',
                description: '讓機器人給予訊息一個反應！',
                options: [
                    {
                        type: 3,
                        name: 'emoji',
                        description: '表情符號',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'message_id',
                        description: '訊息的ID',
                        required: true,
                    },
                ],
            },
            // #endregion
            // #region edit-message
            {
                type: 1,
                name: 'edit-message',
                description: '讓機器人編輯訊息！',
                options: [
                    {
                        type: 3,
                        name: 'message_id',
                        description: '訊息的ID',
                        required: true,
                    },
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
                            '以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...',
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
                ],
            },
            // #endregion
            // #region nick
            {
                type: 1,
                name: 'nick',
                description: '設定機器人的暱稱',
                options: [
                    {
                        type: 3,
                        name: 'nickname',
                        description: '暱稱',
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
                            '以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...',
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
            // #region delete-msg
            {
                type: 1,
                name: 'delete-msg',
                description: '刪除訊息',
                options: [
                    {
                        type: 3,
                        name: 'message_id',
                        description: '訊息ID',
                        required: true,
                    },
                ],
            },
            // #endregion
            // #region set-status
            {
                type: 1,
                name: 'set-status',
                description: '設定機器人狀態[限定機器人擁有者]',
                options: [
                    {
                        type: 3,
                        name: 'name',
                        description: '活動名稱',
                        required: true,
                    },
                    {
                        choices: [
                            {
                                name: '在線',
                                value: 'online',
                            },
                            {
                                name: '閒置',
                                value: 'idle',
                            },
                            {
                                name: '勿擾',
                                value: 'dnd',
                            },
                            {
                                name: '隱形',
                                value: 'invisible',
                            },
                        ],
                        type: 3,
                        name: 'status',
                        description: '狀態',
                        required: true,
                    },
                    {
                        choices: [
                            {
                                name: '正在玩',
                                value: 'PLAYING',
                            },
                            {
                                name: '正在看',
                                value: 'WATCHING',
                            },
                            {
                                name: '正在聽',
                                value: 'LISTENING',
                            },
                            {
                                name: '競爭',
                                value: 'COMPETING',
                            },
                            {
                                name: '直播',
                                value: 'STREAMING',
                            },
                        ],
                        type: 3,
                        name: 'type',
                        description: '活動選擇',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'url',
                        description: '直播連結',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region update
            {
                type: 1,
                name: 'update',
                description: '更新機器人[限定機器人擁有者]',
                options: [
                    {
                        type: 3,
                        name: 'title',
                        description: '更新的重點',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'description',
                        description: '更新的內容',
                        required: true,
                    },
                ],
            },
            // #endregion
            // #region webhook
            {
                type: 1,
                name: 'webhook',
                description: '使用webhook發送訊息',
                options: [
                    {
                        type: 3,
                        name: 'name',
                        description: '名稱',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'avatar',
                        description: '頭像(限用http://或是https://)',
                        required: false,
                    },
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
                            '以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'timestamp',
                        description: '限用數字表示',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'footer',
                        description: '底部文字',
                        required: false,
                    },
                ],
            },
            // #endregion
            // #region clone
            {
                type: 1,
                name: 'clone',
                description: '以特定人士發送訊息',
                options: [
                    {
                        name: 'user',
                        description: '成員',
                        required: false,
                        type: 6,
                    },
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
                            '以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'timestamp',
                        description: '限用數字表示',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'footer',
                        description: '底部文字',
                        required: false,
                    },
                ],
            },
            // #endregion clone
            // #region clone
            {
                type: 1,
                name: 'clone-reactions',
                description: '複製表情符號到你的伺服器！',
                options: [
                    {
                        type: 3,
                        name: 'reactions',
                        description: '你要複製的表情符號(可多選)',
                        required: true,
                    },
                ],
            },
            // #endregion clone

        ],
    },
    clientPermissions: ['ADMINISTRATOR'],
    userPermissions: ['ADMINISTRATOR'],
    /**
     *
     * @param {import('discord.js').Client} client 機器人
     * @param {CommandInteraction} interaction
     * @param {container} container
     */
    run: async (client, interaction, container) => {
        // 取得子指令
        const subcommand = interaction.options.getSubcommand();
        // 執行
        // #region reactions-create
        if (subcommand == 'reactions-create') {
            // 取得命令內容
            // const channel_id =
            //    interaction.options.getString('channel_id') || interaction.channel.id;
            const emoji = interaction.options.getString('emoji');
            const message_id = interaction.options.getString('message_id');
            // const { getChannel } = require('../../../Plugins/discord/message/functions');
            // const msg = getMessage(message_id, channel_id, client)
            // .then(msg => {
            //    msg.react(`${emoji}`)
            // })
            interaction.channel.messages.fetch(message_id)
                .then(message => {
                    // console.info(message.content);
                    message.react(`${emoji}`).catch((error) => {
                        console.error(error);
                        interaction.reply({ content: `啊喔...發生了錯誤：看不懂反應 ${emoji} 是甚麼...` });
                        return;
                    });
                })
                .catch((error) => {
                    console.error(error);
                    interaction.reply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${message_id} 的訊息...` });
                    return;
                });
            // console.info(msg)
            interaction.reply('已新增反應！');

            /*
        //取得頻道
        const channel = client.channels.cache.get(channel_id);
        channel.send('content');
        //取得訊息ID
        const message = client.channel.messages.cache.get(message_id);
        await message.react(emoji)
        */
            /**
        //創建反應
        client.addReaction(channel_id, message_id, emoji, function (data) {
          console.info(data);
        });
        client.sendMessage(channel_id, "owo", function (data) {
          console.info(data);
        });
        */
        }
        // #endregion
        // #region edit-message
        else if (subcommand == 'edit-message') {

            // 取得指令內容
            const channel =
                client.channels.cache.get(
                    interaction.options.getString('channel_id'),
                ) || interaction.channel;
            const content = interaction.options.getString('contents') || undefined;
            const embed = {};
            // EMBED
            // main
            const embed_title = interaction.options.getString('title') || undefined;
            if (embed_title) {
                embed.title = embed_title.replace(/\\n/g, '\n');
            }
            const embed_description =
                interaction.options.getString('description') || undefined;
            if (embed_description) {
                embed.description = embed_description.replace(/\\n/g, '\n');
            }
            const embed_title_url =
                interaction.options.getString('title_url') || undefined;
            if (embed_title_url) {
                embed.url = embed_title_url;
            }
            // author
            const embed_author_name =
                interaction.options.getString('author_name') || undefined;
            if (embed_author_name) {
                embed.author.name = embed_author_name;
            }
            const embed_author_icon =
                interaction.options.getString('author_icon') || undefined;
            if (embed_author_icon) {
                embed.author.icon = embed_author_icon;
            }
            const embed_author_url =
                interaction.options.getString('author_url') || undefined;
            if (embed_author_url) {
                embed.author.url = embed_author_url;
            }
            // thumbnail
            const embed_thumbnail =
                interaction.options.getString('thumbnail') || undefined;
            if (embed_thumbnail) {
                embed.thumbnail.url = embed_thumbnail;
            }
            // image
            const embed_image = interaction.options.getString('image') || undefined;
            if (embed_image) {
                embed.image.url = embed_image;
            }
            // footer
            const embed_footer_text =
                interaction.options.getString('footer_text') || undefined;
            if (embed_footer_text) {
                embed.footer.text = embed_footer_text;
            }
            const embed_footer_icon =
                interaction.options.getString('footer_icon') || undefined;
            if (embed_footer_icon) {
                embed.footer.icon_url = embed_footer_icon;
            }
            // fields
            const embed_fields =
                interaction.options.getString('fields') || undefined;
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
                embed.fields = [fields_return];
            }
            // 取得訊息內容
            const msg = {};
            if (content) {
                msg.content = content.replace(/\\n/g, '\n');
            }

            if (
                embed.title ||
                embed.description ||
                embed.footer ||
                embed.image ||
                embed.thumbnail ||
                embed.fields
            ) {
                // timestamp & color
                const embed_color = interaction.options.getString('color') || '000000';
                if (embed_color) {
                    embed.color = '0x' + embed_color;
                }
                const embed_timestamp =
                    interaction.options.getString('timestamp') || false;
                if (embed_timestamp == true) {
                    embed.timestamp = new Date();
                } else {
                    // 不新增
                }
                // 設定
                msg.embeds = [embed];
            }
            channel.messages.fetch({ around: interaction.options.getString('message_id'), limit: 1 })
                .then(message => {
                    const fetchedMsg = message.first();
                    fetchedMsg.edit(msg);
                    // console.info(msg);
                    // console.info(fetchedMsg.content);
                    interaction.reply({
                        content: '已經成功編輯指定訊息',
                        ephemeral: true,
                    });
                }).catch((error) => {
                    console.error(error);
                    interaction.reply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${interaction.options.getString('message_id')} 的訊息 ...` });
                    return;
                });
            /*
            interaction.channel.messages
                .fetch(interaction.options.getString("message_id"))
                .then(message => {
                    console.info(message.content)
                    const fetchedMsg = message[0]
                    fetchedMsg.edit(msg);
                    interaction.reply({
                        content: '已經成功發送指定訊息',
                        ephemeral: true,
                    });
                });
*/

        }
        // #endregion
        // #region say
        else if (subcommand == 'say') {
            // 取得指令內容
            const channel =
                client.channels.cache.get(
                    interaction.options.getString('channel_id'),
                ) || interaction.channel;
            const content = interaction.options.getString('contents') || undefined;
            const embed = {};
            // EMBED
            // main
            const embed_title = interaction.options.getString('title') || undefined;
            if (embed_title) {
                embed.title = embed_title.replace(/\\n/g, '\n');
            }
            const embed_description =
                interaction.options.getString('description') || undefined;
            if (embed_description) {
                embed.description = embed_description.replace(/\\n/g, '\n');
            }
            const embed_title_url =
                interaction.options.getString('title_url') || undefined;
            if (embed_title_url) {
                embed.url = embed_title_url;
            }
            // author
            const embed_author_name =
                interaction.options.getString('author_name') || undefined;
            const embed_author_icon =
                interaction.options.getString('author_icon') || undefined;
            const embed_author_url =
                interaction.options.getString('author_url') || undefined;
            if (embed_author_name || embed_author_url || embed_author_icon) {
                embed.author = {};
                if (embed_author_name) {
                    embed.author.name = embed_author_name;
                }
                if (embed_author_icon) {
                    embed.author.icon = embed_author_icon;
                }
                if (embed_author_url) {
                    embed.author.url = embed_author_url;
                }
            }
            // thumbnail
            const embed_thumbnail =
                interaction.options.getString('thumbnail') || undefined;
            if (embed_thumbnail) {
                embed.thumbnail = {};
                embed.thumbnail.url = embed_thumbnail;
            }
            // image
            const embed_image = interaction.options.getString('image') || undefined;
            if (embed_image) {
                embed.image = {};
                embed.image.url = embed_image;
            }
            // footer

            const embed_footer_text =
                interaction.options.getString('footer_text') || undefined;
            const embed_footer_icon =
                interaction.options.getString('footer_icon') || undefined;
            if (embed_footer_icon || embed_footer_text) {
                embed.footer = {};
                if (embed_footer_text) {
                    embed.footer.text = embed_footer_text;
                }
                if (embed_footer_icon) {
                    embed.footer.icon_url = embed_footer_icon;
                }
            }
            // fields
            const embed_fields =
                interaction.options.getString('fields') || undefined;
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
                embed.fields = [fields_return];
            }

            // 取得訊息內容
            const msg = {};
            if (content) {
                msg.content = content.replace(/\\n/g, '\n\u200b');
            }

            if (
                embed.title ||
                embed.description ||
                embed.footer ||
                embed.image ||
                embed.thumbnail ||
                embed.fields
            ) {
                // timestamp & color
                const embed_color = interaction.options.getString('color') || '000000';
                if (embed_color) {
                    embed.color = '0x' + embed_color;
                }
                const embed_timestamp =
                    interaction.options.getString('timestamp') || false;
                if (embed_timestamp == true) {
                    embed.timestamp = new Date();
                } else {
                    // 不新增
                }
                // 設定
                msg.embeds = [embed];
            }

            try {
                await channel.send(msg);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: `啊喔...發生了錯誤：無法發送訊息...\n\`\`\`js\n${error}\`\`\`` });
                return;
            }
            await interaction.reply({
                content: '已經成功發送指定訊息',
                ephemeral: true,
            });
        }
        // #endregion
        // #region set-status
        else if (subcommand == 'set-status') {
            if (config.developers.some((id) => interaction.member.user.id == id)) {
                const status = interaction.options.getString('status');
                const name = interaction.options.getString('name');
                const type = interaction.options.getString('type');
                const url = undefined;
                if (type == 'STREAMING') {
                    url = { url: `${interaction.options.getString('url')}` };
                }
                client.user.setPresence({
                    activities: [
                        {
                            name: `${name}`,
                            type: `${type}`,
                            url,
                        },
                    ],
                    // browser: "DISCORD IOS",
                    status: `${status}`,
                });
                interaction.reply({
                    embeds: [
                        new container.Discord.MessageEmbed()
                            .setAuthor({
                                name: interaction.member.user.tag,
                                iconURL: interaction.member.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            })
                            .setColor('#00FF00')
                            .setTimestamp()
                            .setDescription(`成功設定機器人的狀態！\n${status} - **${type}** ${name}`),
                    ],
                    allowedMentions: {
                        repliedUser: false,
                    },
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    embeds: [
                        new container.Discord.MessageEmbed()
                            .setAuthor({
                                name: interaction.member.user.tag,
                                iconURL: interaction.member.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            })
                            .setColor('#FF0000')
                            .setTimestamp()
                            .setDescription('此命令是為機器人的開發人員所使用的。'),
                    ],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
            }
        }
        // #endregion
        // #region delete-msg
        else if (subcommand == 'delete-msg') {
            // 取得指令內容
            interaction.channel.messages.fetch({ around: interaction.options.getString('message_id'), limit: 1 })
                .then(message => {
                    const fetchedMsg = message.first();
                    fetchedMsg.delete().then((deletd_msg) => {
                        interaction.reply({
                            content: '已經成功刪除指定訊息',
                            ephemeral: true,
                        });
                    }).catch((error) =>
                        log('ERROR', error));
                    interaction.reply({
                        content: ':x:錯誤： 無法刪除指定訊息',
                        ephemeral: true,
                    });
                    return;
                }).catch((error) => {
                    console.error(error);
                    interaction.reply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${interaction.options.getString('message_id')} 的訊息 ...` });
                    return;
                });
            /*
            interaction.channel.messages
                .fetch(interaction.options.getString("message_id"))
                .then(message => {
                    console.info(message.content)
                    const fetchedMsg = message[0]
                    fetchedMsg.edit(msg);
                    interaction.reply({
                        content: '已經成功發送指定訊息',
                        ephemeral: true,
                    });
                });
    */

        }
        // #endregion
        // #region webhook
        else if (subcommand == 'webhook') {
            const channel = interaction.channel;
            await interaction.deferReply();

            const username = interaction.options.getString('name') || client.user.username;
            const avatar = interaction.options.getString('avatar') || client.user.avatarURL({ dynamic: true }) || client.user.defaultAvatarURL;

            const content = interaction.options.getString('contents') || undefined;
            const embed = {};
            // EMBED
            // main
            const embed_title = interaction.options.getString('title') || undefined;
            if (embed_title) {
                embed.title = embed_title.replace(/\\n/g, '\n');
            }
            const embed_description =
                interaction.options.getString('description') || undefined;
            if (embed_description) {
                embed.description = embed_description.replace(/\\n/g, '\n');
            }
            const embed_title_url =
                interaction.options.getString('title_url') || undefined;
            if (embed_title_url) {
                embed.url = embed_title_url;
            }
            // author
            const embed_author_name =
                interaction.options.getString('author_name') || undefined;
            const embed_author_icon =
                interaction.options.getString('author_icon') || undefined;
            const embed_author_url =
                interaction.options.getString('author_url') || undefined;
            if (embed_author_name || embed_author_url || embed_author_icon) {
                embed.author = {};
                if (embed_author_name) {
                    embed.author.name = embed_author_name;
                }
                if (embed_author_icon) {
                    embed.author.icon = embed_author_icon;
                }
                if (embed_author_url) {
                    embed.author.url = embed_author_url;
                }
            }
            // thumbnail
            const embed_thumbnail =
                interaction.options.getString('thumbnail') || undefined;
            if (embed_thumbnail) {
                embed.thumbnail = {};
                embed.thumbnail.url = embed_thumbnail;
            }
            // image
            const embed_image = interaction.options.getString('image') || undefined;
            if (embed_image) {
                embed.image = {};
                embed.image.url = embed_image;
            }
            // footer

            const embed_footer_text =
                interaction.options.getString('footer_text') || undefined;
            const embed_footer_icon =
                interaction.options.getString('footer_icon') || undefined;
            if (embed_footer_icon || embed_footer_text) {
                embed.footer = {};
                if (embed_footer_text) {
                    embed.footer.text = embed_footer_text;
                }
                if (embed_footer_icon) {
                    embed.footer.icon_url = embed_footer_icon;
                }
            }
            // fields
            const embed_fields =
                interaction.options.getString('fields') || undefined;
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
                embed.fields = [fields_return];
            }

            // 取得訊息內容
            const msg = {};
            if (content) {
                msg.content = content.replace(/\\n/g, '\n\u200b');
            }

            if (
                embed.title ||
                embed.description ||
                embed.footer ||
                embed.image ||
                embed.thumbnail ||
                embed.fields
            ) {
                // timestamp & color
                const embed_color = interaction.options.getString('color') || '000000';
                if (embed_color) {
                    embed.color = '0x' + embed_color;
                }
                const embed_timestamp =
                    interaction.options.getString('timestamp') || false;
                if (embed_timestamp == true) {
                    embed.timestamp = new Date();
                } else {
                    // 不新增
                }
                // 設定
                msg.embeds = [embed];
            } else msg.embeds = [];

            try {
                const webhooks = await channel.fetchWebhooks();
                let webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    webhook = await interaction.channel.createWebhook(
                        client.user.username + ' - Webhook系統',
                        {
                            avatar:
                                client.user.displayAvatarURL()
                                || client.user.defaultAvatarURL,
                        },
                    );
                }

                await webhook.send({
                    username: username,
                    avatarURL: avatar,
                    content: msg.content,
                    embeds: msg.embeds,
                });
            } catch (error) {
                return await interaction.editReply(`:x: 發生了錯誤：\`\`\`js\n${error}\`\`\``);
            }
            await interaction.editReply('成功發送！');

        }
        // #endregion
        // #region clone-reactions
        else if (subcommand == 'clone-reactions') {
            await interaction.deferReply();
            const reactions = interaction.options.getString('reactions').match(/<\:.*?\:\d*?>/ig);
            const msg = [];
            try {
                reactions.forEach(r => {
                    const id = r.match(/\d{18}/g)[0];
                    const name = r.match(/\:.*?\:/g)[0].replace(':', '').replace(':', '');
                    const animated = r.includes('<a:');
                    const url = animated ? `https://cdn.discordapp.com/emojis/${id}.gif` : `https://cdn.discordapp.com/emojis/${id}.png`;
                    interaction.guild.emojis.create(url, name)
                        .catch(e => {
                            console.error(e);
                            msg.push(`:x: ${name} (${id}) 無法新增！`);
                        });
                });
            } catch (error) {
                return await interaction.editReply({
                    content: `:x: umm... 發生了錯誤...\`${interaction.options.getString('reactions')}\`裡面沒有任何是自訂的表情符號！`,
                });
            }
            await interaction.editReply({
                content: `成功複製部分表情符號！(${msg.length} 個表情符號新增失敗！)`,
            });

        }
        // #endregion
        // #region clone
        else if (subcommand == 'clone') {
            const channel = interaction.channel;
            await interaction.deferReply();
            //
            const user = interaction.options.getMember('user');
            const username = user.nickname || user.user.username;
            const avatar = user.displayAvatarURL({ dynamic: true }) || user.user.defaultAvatarURL;

            const content = interaction.options.getString('contents') || undefined;
            const embed = {};
            // EMBED
            // main
            const embed_title = interaction.options.getString('title') || undefined;
            if (embed_title) {
                embed.title = embed_title.replace(/\\n/g, '\n');
            }
            const embed_description =
                interaction.options.getString('description') || undefined;
            if (embed_description) {
                embed.description = embed_description.replace(/\\n/g, '\n');
            }
            const embed_title_url =
                interaction.options.getString('title_url') || undefined;
            if (embed_title_url) {
                embed.url = embed_title_url;
            }
            // author
            const embed_author_name =
                interaction.options.getString('author_name') || undefined;
            const embed_author_icon =
                interaction.options.getString('author_icon') || undefined;
            const embed_author_url =
                interaction.options.getString('author_url') || undefined;
            if (embed_author_name || embed_author_url || embed_author_icon) {
                embed.author = {};
                if (embed_author_name) {
                    embed.author.name = embed_author_name;
                }
                if (embed_author_icon) {
                    embed.author.icon = embed_author_icon;
                }
                if (embed_author_url) {
                    embed.author.url = embed_author_url;
                }
            }
            // thumbnail
            const embed_thumbnail =
                interaction.options.getString('thumbnail') || undefined;
            if (embed_thumbnail) {
                embed.thumbnail = {};
                embed.thumbnail.url = embed_thumbnail;
            }
            // image
            const embed_image = interaction.options.getString('image') || undefined;
            if (embed_image) {
                embed.image = {};
                embed.image.url = embed_image;
            }
            // footer

            const embed_footer_text =
                interaction.options.getString('footer_text') || undefined;
            const embed_footer_icon =
                interaction.options.getString('footer_icon') || undefined;
            if (embed_footer_icon || embed_footer_text) {
                embed.footer = {};
                if (embed_footer_text) {
                    embed.footer.text = embed_footer_text;
                }
                if (embed_footer_icon) {
                    embed.footer.icon_url = embed_footer_icon;
                }
            }
            // fields
            const embed_fields =
                interaction.options.getString('fields') || undefined;
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
                embed.fields = [fields_return];
            }

            // 取得訊息內容
            const msg = {};
            if (content) {
                msg.content = content.replace(/\\n/g, '\n\u200b');
            }

            if (
                embed.title ||
                embed.description ||
                embed.footer ||
                embed.image ||
                embed.thumbnail ||
                embed.fields
            ) {
                // timestamp & color
                const embed_color = interaction.options.getString('color') || '000000';
                if (embed_color) {
                    embed.color = '0x' + embed_color;
                }
                const embed_timestamp =
                    interaction.options.getString('timestamp') || false;
                if (embed_timestamp == true) {
                    embed.timestamp = new Date();
                } else {
                    // 不新增
                }
                // 設定
                msg.embeds = [embed];
            } else msg.embeds = [];

            try {
                const webhooks = await channel.fetchWebhooks();
                let webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    webhook = await interaction.channel.createWebhook(
                        client.user.username + ' - Webhook系統',
                        {
                            avatar:
                                client.user.displayAvatarURL()
                                || client.user.defaultAvatarURL,
                        },
                    );
                }

                await webhook.send({
                    username: username,
                    avatarURL: avatar,
                    content: msg.content,
                    embeds: msg.embeds,
                });
            } catch (error) {
                return await interaction.editReply(`:x: 發生了錯誤：\`\`\`js\n${error}\`\`\``);
            }
            await interaction.editReply('成功發送！');

        }
        // #endregion
        // #region 未完成
        else {
            try {
                await interaction.reply({
                    content: '此功能尚未完成！ :/',
                });
            } catch {
                await interaction.editReply({
                    content: '此功能尚未完成！ :/',
                });
            }

        }
        // #endregion
    },
};
