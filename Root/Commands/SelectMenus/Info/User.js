const { default: axios } = require('axios');
const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const { get_time_from_id } = require('./../../../Structures/Handlers/get_time_from_id');
module.exports = {
    name: 'info_user',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').SelectMenuInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {

        const member = interaction.guild.members.cache
            .get(interaction.message.embeds[0].footer.text.match(/\d{18}/)[0]);
        const create_at = `${await get_time_from_id(member.user.id)}`;
        const join_at = Math.floor(member.joinedAt.getTime() / 1000);
        const type = interaction.values[0];
        let embed;
        if (type == 'normal') {
            embed = new MessageEmbed()
                .setTitle('成員資訊')
                .setDescription('\`\`\`一般\`\`\`')
                .setAuthor({
                    name: `${member.nickname ?
                        member.nickname + ' (' + member.user.tag + ')'
                        : member.user.tag}`,
                    iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${member.user.id}` })
                .setColor(member.displayHexColor)
                .setTimestamp()
                .addFields(
                    {
                        name: '名稱',
                        value: `\`\`\`${member.user.username}\`\`\``,
                        inline: true,
                    },
                    {
                        name: '匿名',
                        value: `\`\`\`${member.nickname || '沒有暱稱'}\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`${member.user.id}\`\`\``,
                        inline: false,
                    },
                    {
                        name: '識別碼',
                        value: `\`\`\`${member.user.discriminator}\`\`\``,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '創建時間',
                        value: `<t:${create_at}:R>`,
                        inline: true,
                    },
                    {
                        name: '加入時間',
                        value: `<t:${join_at}:R>`,
                        inline: true,
                    },
                    {
                        name: '機器人',
                        value: `\`\`\`${member.user.bot ? '是' : '否'}\`\`\``,
                        inline: true,
                    },
                );
        } else if (type == 'roles') {
            const roles_tag = member.roles.cache
                .filter(role =>
                    role.name != '@everyone',
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

            embed = new MessageEmbed()
                .setTitle('成員資訊')
                .setDescription('\`\`\`身分組\`\`\`')
                .setAuthor({
                    name: `${member.nickname ?
                        member.nickname + ' (' + member.user.tag + ')'
                        : member.user.tag}`,
                    iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${member.user.id}` })
                .setColor(member.displayHexColor)
                .setTimestamp()
                .addFields(
                    {
                        name: `共有 ${roles_tag.length} 個身分組`,
                        value: `${(roles_tag.length != 0) ? list : '沒有身分組！'}`,
                        inline: true,
                    },
                );

        } else if (type == 'permissions') {
            const { translate_Permissions } = require('../../../Language/Language');
            // 有的 member.permissions.toArray
            const has_permissions = member.permissions.toArray();
            const has_permissions_translate = [];
            if (has_permissions.includes('ADMINISTRATOR')) {
                has_permissions_translate.push(translate_Permissions('ADMINISTRATOR', 'zh-TW'));
            } else has_permissions.forEach(p => {
                has_permissions_translate.push(translate_Permissions(p, 'zh-TW'));
            });

            if (client.user.id == member.user.id) {
                const clientPermissions = require('./../../../../bot').config.botPermissions;
                const missing = [];
                clientPermissions.forEach(i => {
                    if (!member.guild.me.permissions.has(i))
                        missing.push(translate_Permissions(i, 'zh-TW'));
                });
                hasPerm = (has_permissions_translate.length != 0);
                hasMiss = (missing.length != 0);
                console.log(hasPerm + ' ' + hasMiss);
                embed = new MessageEmbed()
                    .setTitle('成員資訊')
                    .setDescription('\`\`\`權限\`\`\`')
                    .setAuthor({
                        name: `${member.nickname ?
                            member.nickname + ' (' + member.user.tag + ')'
                            : member.user.tag}`,
                        iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${member.user.id}` })
                    .setColor(member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '權限 (如果缺少將會嚴重影響機器人的運作！)',
                            value: `\`\`\`diff\n${hasPerm ? '+ ' + has_permissions_translate.join('\n+ ') : ''}\n${hasMiss != [] ? '- ' + missing.join('\n- ') : ''}\`\`\``,
                            inline: true,
                        },
                    );

            } else {
                embed = new MessageEmbed()
                    .setTitle('成員資訊')
                    .setDescription('\`\`\`權限\`\`\`')
                    .setAuthor({
                        name: `${member.nickname ?
                            member.nickname + ' (' + member.user.tag + ')'
                            : member.user.tag}`,
                        iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${member.user.id}` })
                    .setColor(member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '權限',
                            value: `\`\`\`diff\n${(has_permissions_translate != []) ? '+ ' + has_permissions_translate.join('\n+ ') : '沒有任何權限...oAo|||'}\`\`\``,
                            inline: true,
                        },
                    );
            }
        } else if (type == 'others') {
            if (client.user.id == member.user.id) {
                const os = require('os');
                const version = require('./../../../../package.json').version;
                const humanizeDuration = require('humanize-duration');
                const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                    conjunction: ' ',
                    language: 'zh_TW',
                })} `;

                //
                // Take the first CPU, considering every CPUs have the same specs
                // and every NodeJS process only uses one at a time.
                const cpu = os.cpus()[0];

                // Accumulate every CPU times values
                const total = Object.values(cpu.times).reduce(
                    (acc, tv) => acc + tv, 0,
                );
                // Normalize the one returned by process.cpuUsage()
                // (microseconds VS miliseconds)
                const usage = process.cpuUsage();
                const currentCPUUsage = (usage.user + usage.system) * 1000;

                // Find out the percentage used for this specific CPU
                const perc = Math.round((currentCPUUsage / total * 100) / 100);

                //
                embed = new MessageEmbed()
                    .setTitle('成員資訊')
                    .setDescription('\`\`\`其他\`\`\`')
                    .setAuthor({
                        name: `${member.nickname ?
                            member.nickname + ' (' + member.user.tag + ')'
                            : member.user.tag}`,
                        iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${member.user.id}` })
                    .setColor(member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '版本',
                            value: `v${version}`,
                            inline: true,
                        },
                        {
                            name: 'Node Js',
                            value: `${process.version}`,
                            inline: true,
                        },
                        {
                            name: 'Discord Js',
                            value: `${(await import('discord.js')).version}`,
                            inline: true,
                        },
                        {
                            name: 'Websocket 延遲:',
                            value: `${client.ws.ping}ms`,
                            inline: true,
                        },
                        {
                            name: '平台: ',
                            value: `\`${process.platform}\``,
                            inline: true,
                        },
                        {
                            name: '記憶體: ',
                            value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB/ ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB\``,
                            inline: true,
                        },
                        {
                            name: 'CPU:',
                            value: `${perc}%`,
                            inline: true,
                        },
                        {
                            name: '運行時間:',
                            value: `${uptime}`,
                            inline: true,
                        },
                    );
            } else {


                /*
                let bannerURL,
                    color
                axios
                    .get(
                        `https://discord.com/api/users/${member.user.id}`,
                        {
                            headers: {
                                Authorization: `Bot ${client.token}`
                            }
                        }
                    )
                    .then((res) => {
                        const { banner, accent_color } = res.data
                        if (banner) {
                            const extension = banner.startsWith("a_") ? ".git" : ".png"
                            bannerURL = `https://cdn.discordapp.com/banners/${member.user.id}/${banner}${extension}`
                            color = accent_color
                        } else {
                            color = accent_color
                        }
                    })
                    */
                embed = new MessageEmbed()
                    .setTitle('成員資訊')
                    .setDescription('\`\`\`其他\`\`\`')
                    .setAuthor({
                        name: `${member.nickname ?
                            member.nickname + ' (' + member.user.tag + ')'
                            : member.user.tag}`,
                        iconURL: `${member.user.displayAvatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true }) || member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${member.user.id}` })
                    .setColor(member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '頭像連結',
                            value: `[點我](${member.displayAvatarURL({ dynamic: true, size: 1024 })
                                || member.avatarURL({ dynamic: true, size: 1024 })
                                || member.user.defaultAvatarURL})`,
                            inline: true,
                        },
                        {
                            name: '橫幅連結',
                            value: `${member.user.banner ? `[點我](${member.user.bannerURL({ dynamic: true, size: 1024 })})` : '沒有橫幅'}`,
                            inline: true,
                        },
                    );
            }
        }

        // 編輯訊息
        interaction.update({
            embeds: [embed],
        });
    },
};