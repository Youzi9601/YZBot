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
const ms = require('ms');
module.exports = {
    command: {
        name: 'giveaway',
        description: '抽獎系統',
        options: [
            {
                type: 1,
                name: 'create',
                description: '創建一個新的抽獎！',
                options: [
                    {
                        type: 3,
                        name: 'prize',
                        description: '獎品內容',
                        required: true,
                    },
                    {
                        type: 3,
                        name: 'duration',
                        description: '時間 (月mo/日d/時h/分m/秒s)',
                        required: true,
                    },
                    {
                        type: 10,
                        name: 'winners',
                        description: '獲獎者數量',
                        required: false,
                    },
                    {
                        type: 7,
                        name: 'channel',
                        description: '頻道',
                        required: false,
                    },
                    {
                        type: 5,
                        name: 'drop',
                        description: '先搶先贏? (等同於先拿到者獲得)',
                        required: false,
                    },
                ],
            },
            {
                type: 1,
                name: 'reroll',
                description: '重新抽出新的幸運兒（消息 ID 或獎品）',
                options: [
                    {
                        type: 3,
                        name: 'giveaway',
                        description: '抽獎活動(可為ID或是獎品內容)',
                        required: true,
                    },
                ],
            },
            {
                type: 1,
                name: 'edit',
                description: '編輯一個抽獎！',
                options: [
                    {
                        type: 3,
                        name: 'message_id',
                        description: '訊息ID',
                        required: true,
                    },
                    {
                        type: 10,
                        name: 'winners',
                        description: '獲獎者數量',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'new_prize',
                        description: '新的獎品內容',
                        required: false,
                    },
                    {
                        type: 3,
                        name: 'addtime',
                        description: '再延後時間[負數為提前時間] (月mo/日d/時h/分m/秒s)',
                        required: false,
                    },
                ],
            },
            {
                type: 1,
                name: 'pause',
                description: '暫停/繼續 一個抽獎',
                options: [
                    {
                        type: 3,
                        name: 'message_id',
                        description: '訊息ID',
                        required: true,
                    },
                ],
            },
        ],
    },
    ignoreFile: false,
    clientPermissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        // 如果成員沒有足夠的權限
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === 'Giveaways')) {
            return interaction.reply({
                content: ':x: 您需要擁有 管理消息權限 或 "Giveaways"身分組 才能使用抽獎命令。',
                ephemeral: true,
            });
        }
        // #region create
        if (subcommand == 'create') {
            // 執行
            const prize = interaction.options.getString('prize');
            const channel = client.channels.cache.get(interaction.options.getChannel('channel')) || interaction.channel;
            const duration = interaction.options.getString('duration');
            const winners = interaction.options.getNumber('winners') || 1;
            const drop = interaction.options.getBoolean('drop') || false;
            if (!channel.isText()) {
                return interaction.reply({
                    content: ':x: 所選的頻道不是文字頻道！',
                    ephemeral: true,
                });
            }
            // Start the giveaway
            client.giveawaysManager.start(channel, {
                // The giveaway duration
                duration: ms(duration),
                // The giveaway prize
                prize: prize,
                // The giveaway winner count
                winnerCount: winners,
                // specify drop
                isDrop: drop,
                // Who hosts this giveaway
                hostedBy: config.plugins.giveaways.host_user ? interaction.user : null,
                // when pause
                pauseOptions: {
                    isPaused: false,
                    content: '⚠️ **抽獎已暫停** ⚠️',
                    unPauseAfter: null,
                    embedColor: '#FFFF00',
                    infiniteDurationText: '`無`',
                },
                // Messages
                messages: {
                    giveaway: (config.plugins.giveaways.everyoneMention ? '@everyone\n\n' : '') + '🎉 **抽獎** 🎉',
                    giveawayEnded: (config.plugins.giveaways.everyoneMention ? '@everyone\n\n' : '') + '🎉 **抽獎結束** 🎉',
                    inviteToParticipate: '點選下方的🎉反應參與！',
                    dropMessage: '成為第一個對🎉做出反應的人！',
                    drawing: '時間： {timestamp}',
                    winMessage: { embed: { description: '恭喜 {winners} 贏得 **{this.prize}** !\n[💬 這裡]({this.messageURL})', color: '0x0174DF' } },
                    embedFooter: `${client.user.username}｜抽獎系統`,
                    noWinner: { embed: { description: ':stop: 抽獎已取消，沒有有效參與。', color: '0x0174DF' } },
                    hostedBy: '由 {this.hostedBy} 主辦 ',
                    winners: '獲獎者',
                    endedAt: '結束於',
                },
            });

            interaction.reply(`抽獎開始於 <#${channel.id}>!`);


        }
        // #endregion
        // #region reroll
        else if (subcommand == 'reroll') {
            const query = interaction.options.getString('giveaway');

            // 嘗試找到帶獎品的贈品，然後使用 ID
            const giveaway =
                // 搜索贈品獎品
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // 使用贈品 ID 搜索
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: '找不到抽獎\`' + query + '\`。',
                    ephemeral: true,
                });
            }

            if (!giveaway.ended) {
                return interaction.reply({
                    content: '贈品還沒有結束。',
                    ephemeral: true,
                });
            }

            // Reroll the giveaway
            client.giveawaysManager.reroll(
                giveaway.messageId,
                {
                    messages: {
                        congrat: { embed: { description: '恭喜新的獲獎者 {winners} 贏得 **{this.prize}** !\n[💬 這裡]({this.messageURL})', color: '0x0174DF' } },
                        error: '沒有有效的參加者，不能選擇新的獲獎者！',
                    },
                },
            )
                .then(() => {
                    // Success message
                    interaction.reply('獎品重新抽出！');
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true,
                    });
                });


        }
        // #endregion
        // #region edit
        else if (subcommand == 'edit') {
            const query = interaction.options.getString('message_id');
            // 嘗試找到帶獎品的贈品，然後使用 ID
            const giveaway =
                // 搜索贈品獎品
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // 使用贈品 ID 搜索
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // const newEnd = ms(interaction.options.getString('time'))
            const options = {
                addTime: ms(interaction.options.getString('addTime')) || null,
                newWinnerCount: interaction.options.getNumber('winners') || giveaway.winnerCount,
                newPrize: new_prize = interaction.options.getString('new_prize') || giveaway.prize,
                // setEndTimestamp: Date.now() + newEnd
            };


            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: ':x: 找不到抽獎\`' + query + '\`。',
                    ephemeral: true,
                });
            }

            if (giveaway.ended) {
                return interaction.reply({
                    content: ':x: 抽獎已經結束。',
                    ephemeral: true,
                });
            }

            // Reroll the giveaway
            client.giveawaysManager.edit(
                giveaway.messageId,
                { options },
            )
                .then(() => {
                    // Success message
                    interaction.reply('獎品重新抽出！');
                })
                .catch((e) => {
                    interaction.reply({
                        content: `:x: 啊喔... 發生了一些狀況...\n已回報給機器人開發者！\n\`\`\`${e}\`\`\` `,
                        ephemeral: true,
                    });
                });


        }
        // #endregion
        // #region pause
        else if (subcommand == 'pause') {
            const query = interaction.options.getString('message_id');

            // 嘗試找到帶獎品的贈品，然後使用 ID
            const giveaway =
                // 搜索贈品獎品
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // 使用贈品 ID 搜索
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: ':x: 找不到抽獎\`' + query + '\`。',
                    ephemeral: true,
                });
            }

            if (giveaway.ended) {
                return interaction.reply({
                    content: ':x: 抽獎已經結束。',
                    ephemeral: true,
                });
            }
            if (giveaway.pauseOptions.isPaused) {
                client.giveawaysManager.unpause(giveaway.messageId)
                    .then(() => {
                        // Success message
                        interaction.reply('成功繼續抽獎！');
                    })
                    .catch((e) => {
                        interaction.reply({
                            content: `:x: 啊喔... 發生了一些狀況...\n已回報給機器人開發者！\n\`\`\`${e}\`\`\` `,
                            ephemeral: true,
                        });
                    });
            } else {
                // Reroll the giveaway
                client.giveawaysManager.pause(giveaway.messageId)
                    .then(() => {
                        // Success message
                        interaction.reply('成功暫停抽獎！');
                    })
                    .catch((e) => {
                        interaction.reply({
                            content: `:x: 啊喔... 發生了一些狀況...\n已回報給機器人開發者！\n\`\`\`${e}\`\`\` `,
                            ephemeral: true,
                        });
                    });
            }

        }
        // #endregion

        // 尚未完工
        else interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
    },
};