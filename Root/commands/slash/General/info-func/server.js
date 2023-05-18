const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time } = require('discord.js');

module.exports = { load };
/**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`slash-info_server-${interaction.createdTimestamp}`)
                .setPlaceholder('請選擇資訊類別')
                .addOptions([
                    {
                        label: '基本',
                        description: '基本的伺服器資訊',
                        value: 'normal',
                    },
                    {
                        label: '成員',
                        description: '成員統計',
                        value: 'members',
                    },
                    {
                        label: '身分組',
                        description: '身分組統計',
                        value: 'roles',
                    },
                    {
                        label: '頻道',
                        description: '頻道統計',
                        value: 'channels',
                    },
                    {
                        label: '表情符號&貼圖',
                        description: '表情符號與貼圖統計',
                        value: 'emojis-stikers',
                    },
                    {
                        label: '其他',
                        description: '有關其他的資訊',
                        value: 'others',
                    },
                ]),
        );
    // 嵌入
    const serverinfo = new EmbedBuilder()
        .setTitle('伺服器資訊')
        .setDescription('請選擇一個類別！')
        .setAuthor({
            name: `${interaction.guild.name}`,
        })
        .setColor(0x0098d9)
        .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
        })
        .setTimestamp();

    if (interaction.guild.iconURL()) {
        serverinfo.data.image = { url: `${interaction.guild.iconURL({ dynamic: true })}` };
        serverinfo.data.author.icon_url = interaction.guild.iconURL({ dynamic: true });
    }
    if (interaction.guild.bannerURL()) {
        serverinfo.data.thumbnail = { url: interaction.guild.bannerURL };
    }


    // 返回訊息
    interaction.reply({ embeds: [serverinfo], components: [row], ephemeral:true });
    // #endregion

    const filter = i => i.customId === `slash-info_server-${interaction.createdTimestamp}`;
    const collector = interaction.channel.createMessageComponentCollector(
        {
            filter,
            // 10分鐘
            time: 10 * 60 * 1000,
            componentType: ComponentType.StringSelect,
        },
    );
    collector.on('collect', async collector_interaction => {

        const type = collector_interaction.values[0];
        const collect_serverinfo = new EmbedBuilder()
            .setTitle('伺服器資訊')
            .setDescription('請選擇一個類別！')
            .setAuthor({
                name: `${interaction.guild.name}`,
            })
            .setColor(0x0098d9)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp();
        const guild = collector_interaction.guild;

        if (type == 'normal') {
            collect_serverinfo.data.description = '\`\`\`一般\`\`\`';

            collect_serverinfo.setFields(
                [
                    {
                        name: '名稱',
                        value: `\`\`\`${guild.name}\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`${guild.id}\`\`\``,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '所有者',
                        value: `<@${guild.ownerId}>`,
                        inline: true,
                    },
                    {
                        name: '創建時間',
                        value: `${time(collector_interaction.guild.createdAt, 'R')}`,
                        inline: true,
                    },
                ],
            );

        } else if (type == 'members') {
            collect_serverinfo.data.description = '\`\`\`成員\`\`\`';

            collect_serverinfo.setFields(
                [
                    {
                        name: '人數',
                        value: `\`\`\`${guild.memberCount} 人\`\`\``,
                        inline: true,
                    },
                    {
                        name: '成員',
                        value: `\`\`\`${guild.members.cache.filter((m) => !m.user.bot).size} 人\`\`\``,
                        inline: true,
                    },
                    {
                        name: '機器人',
                        value: `\`\`\`${guild.members.cache.filter((m) => m.user.bot).size} 人\`\`\``,
                        inline: true,
                    },
                ],
            );
        } else if (type == 'roles') {
            collect_serverinfo.data.description = '\`\`\`身分組\`\`\`';

            const roles_tag = guild.roles.cache
                .filter(role =>
                    role.name != '@everyone' && !role.tags.botId,
                )
                .map(
                    role => `<@&${role.id}>`,
                );
            const role_list = roles_tag; // .join(' \u200B')
            let max = false;
            for (let i = 0; role_list.join(' \u200B').length > 1024; i++) {
                role_list.pop();
                max = true;
            }
            const list = role_list.join(' \u200B') + `${max ? '...還有更多' : ''}`;
            /**
             * `${roles_tag.length > 1024 ? ``}:``)
             * <@909608773927202906> \u200B
             */
            collect_serverinfo.setFields(
                [
                    {
                        name: `共有 ${roles_tag.length} 個身分組(不包含機器人權限身分組以及@everyone)`,
                        value: `${(roles_tag.length != 0) ? list : '沒有身分組！'}`,
                        inline: true,
                    },
                ],
            );
        } else if (type == 'channels') {
            collect_serverinfo.data.description = '\`\`\`頻道\`\`\`';

            collect_serverinfo.setFields(
                [
                    {
                        name: `合計${guild.channels.cache.size}個頻道`,
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '文字頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_TEXT').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '語音頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_VOICE').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '類別頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_CATEGORY').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '公告頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_NEWS').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '舞台頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_STAGE_VOICE').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '討論串',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_NEWS_THREAD' || c.type == 'GUILD_PUBLIC_THREAD' || c.type == 'GUILD_PRIVATE_THREAD').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '商店頻道',
                        value: `\`\`\`${guild.channels.cache.filter((c) => c.type == 'GUILD_STORE').size}個\`\`\``,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '特殊頻道',
                        value: [
                            '**規則頻道**',
                            `> ${collector_interaction.guild.rulesChannelId ? `<#${collector_interaction.guild.rulesChannelId}>` : '無'}`,
                            '**AFK頻道**',
                            `> ${collector_interaction.guild.afkChannelId ? `<#${collector_interaction.guild.afkChannelId}>` : '無'}`,
                            '**小工具頻道**',
                            `> ${collector_interaction.guild.widgetChannelId ? `<#${collector_interaction.guild.widgetChannelId}>` : '無'}`,
                            '**系統頻道**',
                            `> ${collector_interaction.guild.systemChannelId ? `<#${collector_interaction.guild.systemChannelId}>` : '無'}`,
                            '**Discord更新頻道**',
                            `> ${collector_interaction.guild.publicUpdatesChannelId ? `<#${collector_interaction.guild.publicUpdatesChannelId}>` : '無'}`,
                        ].join('\n'),
                        inline: false,
                    },
                ],
            );
        } else if (type == 'emojis-stikers') {
            collect_serverinfo.data.description = '\`\`\`表情符號與貼圖\`\`\`';

            collect_serverinfo.setFields([
                {
                    name: `表情符號共${guild.emojis.cache.size}個`,
                    value: '\u200B',
                    inline: false,
                },
                {
                    name: '可使用',
                    value: `\`\`\`${guild.emojis.cache.filter(e => e.available == true).size}個 \`\`\``,
                    inline: true,
                },
                {
                    name: '一般',
                    value: `\`\`\`${guild.emojis.cache.filter(e => e.animated == false).size}個 \`\`\``,
                    inline: true,
                },
                {
                    name: '動態',
                    value: `\`\`\`${guild.emojis.cache.filter(e => e.animated == true).size}個 \`\`\``,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },
                {
                    name: `貼圖共${guild.stickers.cache.size}個`,
                    value: '\u200B',
                    inline: false,
                },
                {
                    name: '可使用',
                    value: `\`\`\`${guild.stickers.cache.filter(s => s.available).size}個\`\`\``,
                    inline: true,
                },
            ],
            );


        } else if (type == 'others') {
            const language = client.language_data(interaction.locale, 'discord');

            collect_serverinfo.data.description = '\`\`\`其他\`\`\`';

            // const { translate_Tier, translate_Level } = require('./../../../Language/Language');
            collect_serverinfo.setFields(
                [
                    {
                        name: '加成',
                        value: `\`\`\`${language.Tier[guild.premiumTier]}, ${guild.premiumSubscriptionCount}次加成\`\`\``,
                        inline: false,
                    },
                    {
                        name: '語言環境',
                        value: `\`\`\`${guild.preferredLocale}\`\`\``,
                        inline: true,
                    },
                    {
                        name: '驗證等級',
                        value: `\`\`\`${language.Level[guild.verificationLevel]}\`\`\``,
                        inline: true,
                    },
                ],
            );

        }

        if (collector_interaction.guild.iconURL()) {
            collect_serverinfo.data.image = { url: `${collector_interaction.guild.iconURL({ dynamic: true })}` };
            collect_serverinfo.data.author.icon_url = collector_interaction.guild.iconURL({ dynamic: true });
        }
        if (collector_interaction.guild.bannerURL()) {
            collect_serverinfo.data.thumbnail = { urll: collector_interaction.guild.bannerURL };
        }

        collector_interaction.update({
            embeds: [collect_serverinfo],
        });
    });
}