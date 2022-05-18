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
                    {
                        type: 3,
                        name: 'id',
                        description: '指向的跨群ID [限用數字或是英文字母，不分大小寫！]',
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

        if (!isNotTextChannel) {
            // 無
        } else {
            // #region chat_bot
            if (subcommand == 'chat-bot') {
                var chat_bot = new db.table('chat_bot_system');
                chat_bot.set(`${interaction.guild.id}`, { channelid: channel.id });
            }
            // #endregion
            // #region suggestions-channel
            else if (subcommand == 'suggestions-channel') {
                interaction.deferReply();
                var suggestions_system = new db.table('suggestions_system');
                suggestions_system.set(`${interaction.guild.id}`, { channelid: channel.id, num: 0 });
            }
            // #endregion
            // #region counting
            else if (subcommand == 'counting') {

                interaction.deferReply();
                var countting_system = new db.table('countting_system');
                countting_system.set(`${interaction.guild.id}`, {
                    channelid: channel.id,
                    WrongReset: `${interaction.options.getBoolean('wrong_reset')}` || `true`,
                    noTwice: `${interaction.options.getBoolean('no_twice')}` || `true`,
                });

            }
            // #endregion
            // #region cross-servers
            else if (subcommand == 'corss-servers') {
                interaction.deferReply();
                var cross_server_system = new db.table('cross_server_system');
                // 取得資料
                const cross_id = interaction.options.getString('id');
                const webhook = channel.createWebhook(
                    'YZB 跨群聊天',
                    {
                        avatar:
                            client.user.displayAvatarURL()
                            || client.user.defaultAvatarURL,
                    },
                );

                console.log(webhook);
                channel.sendTyping();
                channel.send(`跨群代碼： ${cross_id}`);
                interaction.deferReply();
                cross_server_system.set(`${interaction.guild.id}`, {
                    guildid: interaction.guild.id,
                    channelid: channel.id,
                    cross_id: cross_id,
                    webhook_token: webhook.token,
                    webhook_id: webhook.id,
                });
            }
            // #endregion
            // else
            else return interaction.reply({
                content: '此功能尚未完成！ :/',
                ephemeral: true,
            }).catch((err) => { });


            try {
                channel.sendTyping();
                channel.send({ content: `這裡！ <@${interaction.user.id}>` });
            } catch (error) {
                //
            }

        }

        interaction.reply({
            content: `${subcommand} 的頻道成功指向 <#${channel.id}> ，去試試看?`,
        })
            .catch((err) => {
                interaction.editReply({
                    content: `${subcommand} 的頻道成功指向 <#${channel.id}>，去試試看?`,
                }).catch((err) => {

                });
            });


        // 執行

        // 檢測不是文字頻道?
        function isNotTextChannel(interaction) {
            if (!channel.isText) {
                interaction.reply({ content: '這不是文字頻道！' });
                return true;
            } else return false;
        }

    },
};