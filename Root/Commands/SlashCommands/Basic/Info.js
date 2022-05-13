const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    CommandInteraction,
} = require('discord.js');
const { translate_Level } = require('./../../../Language/Language');
module.exports = {
    command: {
        name: 'info',
        description: '資訊',
        options: [
            // #region info
            {
                type: 1,
                name: 'user',
                description: '取得成員資訊',
                options: [
                    {
                        type: 6,
                        name: 'user',
                        description: '成員',
                        required: false,
                    },
                ],
            },
            {
                type: 1,
                name: 'server',
                description: '取得伺服器資訊',
                options: [
                ],
            },
            {
                type: 1,
                name: 'bot',
                description: '取得機器人資訊',
                options: [
                ],
            },
        ],
        // #endregion
    },
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 10000,
    /**
     *
     * @param {import('discord.js').Client} client 機器人
     * @param {CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == 'server') {
            // #region server
            // 取得時間
            const DISCORD_EPOCH = 1420070400000;

            function convertSnowflakeToDate(snowflake) {
                return new Date(snowflake / 4194304 + DISCORD_EPOCH);
            }
            const input = `${interaction.guild.id}`;
            const snowflake = Number(input.replace(/[^0-9]+/g, ''));
            const timestamp = convertSnowflakeToDate(snowflake);
            const create_at = `${Math.floor(timestamp.getTime() / 1000)}`;
            // 嵌入
            const serverinfo = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('伺服器資訊')
                .setThumbnail(
                    `${interaction.guild.iconURL() || client.user.displayAvatarURL({ dynamic: true })}`,
                )
                .setDescription(' ')
                .setFooter({
                    text: `${interaction.member.user.tag}`,
                    iconURL: `${interaction.member.user.displayAvatarURL({
                        dynamic: true,
                    })}`,
                })
                .addFields({
                    name: '基本',
                    value: [
                        '**伺服器名稱**',
                        `> ${interaction.guild.name} \n(ID: \`${interaction.guild.id}\`)`,
                        '**擁有者**',
                        `> <@${interaction.guild.ownerId}>`,
                        '**創建時間**',
                        `> <t:${create_at}:R>,`,
                        '**人數**',
                        `> 總共 ${interaction.guild.memberCount} 人`,
                        `> 成員 ${interaction.guild.members.cache.filter((m) => !m.user.bot).size
                        } 人 / 機器人 ${interaction.guild.members.cache.filter((m) => m.user.bot).size
                        } 人`,
                        '**加成**',
                        `> ${interaction.guild.premiumTier} 等級`,
                        `> ${interaction.guild.premiumSubscriptionCount} 個加成`,
                        '**驗證等級**',
                        `> ${translate_Level(interaction.guild.verificationLevel, 'zh-TW')}`,
                        '**語言環境**',
                        `> ${interaction.guild.preferredLocale}`,
                    ].join('\n'),

                    inline: true,
                })
                .addFields({
                    name: '頻道',
                    value: [
                        '**統計**',
                        `> ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_TEXT',
                        ).size
                        } 個文字頻道`,
                        `> ╰ ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_PUBLIC_THREAD',
                        ).size
                        } 個討論串`,
                        `> ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_VOICE',
                        ).size
                        } 個語音頻道`,
                        `> ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_NEWS',
                        ).size
                        } 個公告頻道`,
                        `> ╰ ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_NEWS_THREAD',
                        ).size
                        } 個討論串`,
                        `> ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_STAGE_VOICE',
                        ).size
                        } 個活動頻道`,
                        `> ${interaction.guild.channels.cache.filter(
                            (c) => c.type === 'GUILD_CATEGORY',
                        ).size
                        } 個類別`,
                        '**規則頻道**',
                        `> <#${interaction.guild.rulesChannelId}>`,
                        '**AFK頻道**',
                        `> <#${interaction.guild.afkChannelId}>`,
                        '**小工具頻道**',
                        `> <#${interaction.guild.widgetChannelId}>`,
                        '**系統頻道**',
                        `> <#${interaction.guild.systemChannelId}>`,
                        '**Discord更新頻道**',
                        `> <#${interaction.guild.publicUpdatesChannelId}>`,
                    ].join('\n'),
                    inline: true,
                });
            // 返回訊息
            interaction.reply({ embeds: [serverinfo] });
            // #endregion
        } else if (subcommand == 'user') {
            // #region user

            // 取得成員
            const user = interaction.options.getMember('user') || interaction.user || client.user;
            const member = await interaction.guild.members.fetch(user).catch(() => { });
            // 取得時間
            const DISCORD_EPOCH = 1420070400000;

            function convertSnowflakeToDate(snowflake) {
                return new Date(snowflake / 4194304 + DISCORD_EPOCH);
            }
            const user_input = `${user}`;
            const user_snowflake = Number(user_input.replace(/[^0-9]+/g, ''));
            const user_timestamp = convertSnowflakeToDate(user_snowflake);
            const create_at = `${Math.floor(user_timestamp.getTime() / 1000)}`;
            const user_joinedtime = `${member.joinedTimestamp}`;
            const join_at = `${Math.floor(member.joinedTimestamp / 1000)}`;
            // 嵌入
            const userinfo = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('成員資訊')
                .setThumbnail(
                    `${user.displayAvatarURL({ dynamic: true }) || user.defaultAvatarURL}`,
                )
                .setDescription(' ')
                .setFooter({
                    text: `${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL(
                        {
                            dynamic: true,
                        })
                        || interaction.user.defaultAvatarURL}`,
                })
                .addFields({
                    name: '名稱',
                    value: `${member.user.username}`,
                    inline: true,
                })
                .addFields({
                    name: '匿名',
                    value: `${member.nickname || '沒有暱稱'}`,
                    inline: true,
                })
                .addFields({
                    name: '識別碼',
                    value: `${member.user.discriminator}`,
                    inline: true,
                })
                .addFields({
                    name: 'ID',
                    value: `${member.id}`,
                    inline: true,
                })
                .addFields({
                    name: '機器人',
                    value: `${member.user.bot ? '是' : '否'}`,
                    inline: true,
                })
                .addFields({
                    name: '創建時間',
                    value: `<t:${create_at}:R>`,
                })
                .addFields({
                    name: '加入時間',
                    value: `<t:${join_at}:R>`,
                });
            /**
             if (member.id == `${client.user.id}`) {
                userinfo = new container.Discord.MessageEmbed()
                .addFields({
                    name: `更多資訊`,
                    value: [
                        `伺服器數量`,
                        `${client.guilds.cache.size}`,
                        `成員數量`,
                        `${client.users.cache.size}`,
                        `Node.JS版本`,
                        `${process.version}`,
                    ].join(`\n`),
                })
            }
             */
            // 返回訊息
            interaction.reply({ embeds: [userinfo] });
            // #endregion
        } else if (subcommand == 'bot') {
            // #region bot

            // 取得成員
            const user = client.user;
            const member = await interaction.guild.members.fetch(user).catch(() => { });
            // 取得時間
            const DISCORD_EPOCH = 1420070400000;

            function convertSnowflakeToDate(snowflake) {
                return new Date(snowflake / 4194304 + DISCORD_EPOCH);
            }
            const user_input = `${user}`;
            const user_snowflake = Number(user_input.replace(/[^0-9]+/g, ''));
            const user_timestamp = convertSnowflakeToDate(user_snowflake);
            const create_at = `${Math.floor(user_timestamp.getTime() / 1000)}`;
            const user_joinedtime = `${member.joinedTimestamp}`;
            const join_at = `${Math.floor(member.joinedTimestamp / 1000)}`;
            // 嵌入
            const userinfo = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle('成員資訊')
                .setThumbnail(
                    `${member.displayAvatarURL({ dynamic: true }) || member.defaultAvatarURL}`,
                )
                .setDescription(' ')
                .setFooter({
                    text: `${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        dynamic: true,
                    }) || interaction.user.defaultAvatarURL}`,
                })
                .addFields({
                    name: '名稱',
                    value: `${member.user.username}`,
                    inline: true,
                })
                .addFields({
                    name: '匿名',
                    value: `${member.nickname || '沒有暱稱'}`,
                    inline: true,
                })
                .addFields({
                    name: '識別碼',
                    value: `${member.user.discriminator}`,
                    inline: true,
                })
                .addFields({
                    name: 'ID',
                    value: `${member.id}`,
                    inline: true,
                })
                .addFields({
                    name: '機器人',
                    value: `${member.user.bot ? '是' : '否'}`,
                    inline: true,
                })
                .addFields({
                    name: '創建時間',
                    value: `<t:${create_at}:R>`,
                })
                .addFields({
                    name: '加入時間',
                    value: `<t:${join_at}:R>`,
                })
                .addFields({
                    name: '更多資訊',
                    value: [
                        '伺服器數量',
                        `${client.guilds.cache.size}`,
                        '成員數量',
                        `${client.users.cache.size}`,
                        'Node.JS版本',
                        `${process.version}`,
                    ].join('\n'),
                });

            // 返回訊息
            interaction.reply({ embeds: [userinfo] });
            // #endregion
        }
    },
};
