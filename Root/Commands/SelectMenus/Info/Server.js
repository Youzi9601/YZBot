const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    name: 'info_server',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').SelectMenuInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const type = interaction.values[0];
        const serverinfo = new MessageEmbed()
            .setTitle('伺服器資訊')
            .setAuthor({
                name: `${interaction.guild.name}`,
            })
            .setFooter({ text: `ID: ${interaction.guild.id}` })
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter({
                text: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                iconURL: `${interaction.member.user.displayAvatarURL({
                    dynamic: true,
                })}`,
            });
        const guild = interaction.guild;

        if (type == 'normal') {
            serverinfo.description = '\`\`\`一般\`\`\`';
            const { get_time_from_id } = require('./../../../Structures/Handlers/get_time_from_id');
            const create_at = await get_time_from_id(interaction.guild.id);
            serverinfo.fields.push(
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
                    value: `<t:${await get_time_from_id(guild.id)}:R>`,
                    inline: true,
                },
            );

        } else if (type == 'members') {
            serverinfo.description = '\`\`\`成員\`\`\`';

            serverinfo.fields.push(
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
            );
        } else if (type == 'roles') {
            serverinfo.description = '\`\`\`身分組\`\`\`';

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
            serverinfo.fields.push(
                {
                    name: `共有 ${roles_tag.length} 個身分組(不包含機器人權限身分組以及@everyone)`,
                    value: `${(roles_tag.length != 0) ? list : '沒有身分組！'}`,
                    inline: true,
                },
            );
        } else if (type == 'channels') {
            serverinfo.description = '\`\`\`頻道\`\`\`';

            serverinfo.fields.push(
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
                        `> ${interaction.guild.rulesChannelId ? `<#${interaction.guild.rulesChannelId}>` : '無'}`,
                        '**AFK頻道**',
                        `> ${interaction.guild.afkChannelId ? `<#${interaction.guild.afkChannelId}>` : '無'}`,
                        '**小工具頻道**',
                        `> ${interaction.guild.widgetChannelId ? `<#${interaction.guild.widgetChannelId}>` : '無'}`,
                        '**系統頻道**',
                        `> ${interaction.guild.systemChannelId ? `<#${interaction.guild.systemChannelId}>` : '無'}`,
                        '**Discord更新頻道**',
                        `> ${interaction.guild.publicUpdatesChannelId ? `<#${interaction.guild.publicUpdatesChannelId}>` : '無'}`,
                    ].join('\n'),
                    inline: false,
                },
            );
        } else if (type == 'emojis-stikers') {
            serverinfo.description = '\`\`\`表情符號與貼圖\`\`\`';

            serverinfo.fields.push(
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
            );

        } else if (type == 'others') {
            serverinfo.description = '\`\`\`其他\`\`\`';

            const { translate_Tier, translate_Level } = require('./../../../Language/Language');
            serverinfo.fields.push(
                {
                    name: '加成',
                    value: `\`\`\`${translate_Tier(guild.premiumTier, 'zh-TW')}, ${guild.premiumSubscriptionCount}次加成\`\`\``,
                    inline: false,
                },
                {
                    name: '語言環境',
                    value: `\`\`\`${guild.preferredLocale}\`\`\``,
                    inline: true,
                },
                {
                    name: '驗證等級',
                    value: `\`\`\`${translate_Level(guild.verificationLevel, 'zh-TW')}\`\`\``,
                    inline: true,
                },
            );

        }

        if (interaction.guild.iconURL()) {
            serverinfo.image = { url: `${interaction.guild.iconURL({ dynamic: true })}` };
            serverinfo.author.iconURL = interaction.guild.iconURL({ dynamic: true });
        }
        if (interaction.guild.bannerURL()) {
            serverinfo.thumbnail = { urll: interaction.guild.bannerURL };
        }

        interaction.update({
            embeds: [serverinfo],
        });
    },
};