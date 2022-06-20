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

        /** @param {import('discord.js').TextChannel} channel */
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        if (!isNotTextChannel) {
            // 無
        } else {
            // #region chat_bot
            if (subcommand == 'chat-bot') {
                var chat_bot = new db.table('chat_bot_system');
                chat_bot.set(`${ interaction.guild.id }`, { channelid: channel.id });
            }
            // #endregion
            // #region suggestions-channel
            else if (subcommand == 'suggestions-channel') {
                interaction.deferReply();
                var suggestions_system = new db.table('suggestions_system');
                suggestions_system.set(`${ interaction.guild.id }`, { channelid: channel.id, num: 0 });
            }
            // #endregion
            // #region counting
            else if (subcommand == 'counting') {

                interaction.deferReply();
                var countting_system = new db.table('countting_system');
                countting_system.set(`${ interaction.guild.id }`, {
                    channelid: channel.id,
                    WrongReset: `${ interaction.options.getBoolean('wrong_reset') }` || 'true',
                    noTwice: `${ interaction.options.getBoolean('no_twice') }` || 'true',
                });

            }
            // #endregion
            // #region cross-servers
            else if (subcommand == 'corss-servers') {
                // 如果非官方人員
                if (!config.developers.some(id => interaction.user.id == id)) interaction.reply({
                    embeds: [new container.Discord.MessageEmbed()
                        .setAuthor({
                            name: interaction.member.user.tag,
                            iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                        })
                        .setColor('#FF0000')
                        .setTimestamp()
                        .setDescription('[跨群系統暫不開放]：此命令是為機器人的開發人員所使用的。')],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });

                await interaction.deferReply();
                var cross_server_system = new db.table('cross_server_system');
                // 取得資料
                const cross_id = 'main' || interaction.options.getString('id');

                // 搜尋&檢查
                const guild_data = cross_server_system.get(message.guild.id)
                /*
                [
                    {
                        channelID: '100000',
                        id: 'a'
                    },
                    {
                        channelID: '120000',
                        id: 'b'
                    },
                ]
                */
                // 尋找channelID，並刪除該資料
                guild_data.forEach(data => {
                    if (data.channelID == channel.id) {
                        const pos = guild_data.indexOf({ channelID: channel.id })
                        guild_data.splice(pos, 1)
                    }
                })
                // 將資料放入
                guild_data.push(
                    {
                        "channelID": channel.id,
                        "id": cross_id
                    }
                )
                // cross_server_system.get(`${interaction.guild.id}`)
                // 如果沒有，則新增它
                cross_server_system.set(`${ interaction.guild.id }`,
                    guild_data
                )


                //
                await channel.sendTyping();
                await channel.send(`跨群代碼： ${ cross_id } (因為目前暫時鎖定只開一個)，只是目前沒有跨群的作用...你想做啥==`);
                //
                await interaction.editReply('成功創立跨群！');
            }
            // #endregion
            // else
            else return await interaction.reply({
                content: '此功能尚未完成！ :/',
                ephemeral: true,
            }).catch((err) => { });


            try {
                channel.sendTyping();
                channel.send({ content: `這裡！ <@${ interaction.user.id }>` });
            } catch (error) {
                //
            }

        }

        interaction.reply({
            content: `${ subcommand } 的頻道成功指向 <#${ channel.id }> ，去試試看?`,
        })
            .catch((err) => {
                interaction.editReply({
                    content: `${ subcommand } 的頻道成功指向 <#${ channel.id }>，去試試看?`,
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