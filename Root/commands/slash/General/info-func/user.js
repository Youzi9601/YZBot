const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, PermissionsBitField } = require('discord.js');
const { readFile, readFileSync } = require('fs');

module.exports = { load };
/**
     *
     * @param {import('./../../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    // #region user

    // 取得成員
    const user = interaction.options.getMember('user') || interaction.user || client.user;
    const member = await interaction.guild.members.fetch(user).catch(() => { });

    // 選單
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`slash-info_user-${interaction.createdTimestamp}`)
                .setPlaceholder('請選擇資訊類別')
                .addOptions([
                    {
                        label: '基本',
                        description: '基本的成員資訊',
                        value: 'normal',
                    },
                    {
                        label: '身分組',
                        description: '成員所擁有的身分組',
                        value: 'roles',
                    },
                    {
                        label: '權限',
                        description: '成員所擁有的權限',
                        value: 'permissions',
                    },
                    {
                        label: '其他',
                        description: '有關其他的資訊',
                        value: 'others',
                    },
                ]),
        );
    // 嵌入
    const userinfo = new EmbedBuilder()
        .setTitle('成員資訊')
        .setDescription('請選擇一個類別！')
        .setAuthor({
            name: `${member.nickname ?
                member.nickname + ' (' + member.user.tag + ')'
                : member.user.tag}`,
            iconURL: `${user.displayAvatarURL({ dynamic: true }) || user.avatarURL({ dynamic: true }) || user.defaultAvatarURL}`,
        })
        .setFooter({ text: `ID: ${user.id}` })
        .setColor(member.displayHexColor)
        .setTimestamp();
    /**
             if (member.id == `${client.user.id}`) {
                userinfo = new container.Discord.EmbedBuilder()
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
    interaction.reply({ embeds: [userinfo], components: [row], ephemeral: true });
    // #endregion
    const filter = i => i.customId === `slash-info_user-${interaction.createdTimestamp}`;
    const collector = interaction.channel.createMessageComponentCollector(
        {
            filter,
            // 10分鐘
            time: 10 * 60 * 1000,
            componentType: ComponentType.StringSelect,
        },
    );
    collector.on('collect', async collector_interaction => {

        const collector_member = collector_interaction.guild.members.cache
            .get(collector_interaction.message.embeds[0].footer.text.match(/\d+/)[0]);

        const join_at = Math.floor(collector_member.joinedAt.getTime() / 1000);
        const type = collector_interaction.values[0];
        let embed;
        let content = '';
        if (type == 'normal') {
            embed = new EmbedBuilder()
                .setTitle('成員資訊')
                .setDescription('一般')
                .setAuthor({
                    name: `${collector_member.nickname ?
                        collector_member.nickname + ' (' + collector_member.user.tag + ')'
                        : collector_member.user.tag}`,
                    iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${collector_member.user.id}` })
                .setColor(collector_member.displayHexColor)
                .setTimestamp()
                .addFields(
                    {
                        name: '名稱',
                        value: `${collector_member.user.username}`,
                        inline: true,
                    },
                    {
                        name: '匿名',
                        value: `${collector_member.nickname || '沒有暱稱'}`,
                        inline: true,
                    },
                    {
                        name: 'ID',
                        value: `${collector_member.user.id}`,
                        inline: false,
                    },
                    {
                        name: '識別碼',
                        value: `${collector_member.user.discriminator}`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '創建時間',
                        value: `${time(new Date(collector_member.user.id / 4194304 + 1420070400000), 'R')}`,
                        inline: true,
                    },
                    {
                        name: '加入時間',
                        value: `<t:${join_at}:R>`,
                        inline: true,
                    },
                    {
                        name: '機器人',
                        value: `${collector_member.user.bot ? '是' : '否'}`,
                        inline: true,
                    },
                );
        } else if (type == 'roles') {
            const roles_tag = collector_member.roles.cache
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

            embed = new EmbedBuilder()
                .setTitle('成員資訊')
                .setDescription('身分組')
                .setAuthor({
                    name: `${collector_member.nickname ?
                        collector_member.nickname + ' (' + collector_member.user.tag + ')'
                        : collector_member.user.tag}`,
                    iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${collector_member.user.id}` })
                .setColor(collector_member.displayHexColor)
                .setTimestamp()
                .addFields(
                    {
                        name: `共有 ${roles_tag.length} 個身分組`,
                        value: `${(roles_tag.length != 0) ? list : '沒有身分組！'}`,
                        inline: true,
                    },
                );

        } else if (type == 'permissions') {
            const language = client.language_data(interaction.locale, 'discord#Permissions');
            // 有的 member.permissions.toArray
            const has_permissions = collector_member.permissions.toArray();
            const has_permissions_translate = [];
            if (has_permissions.includes('Administrator')) {
                has_permissions_translate.push(language['Administrator']);
            } else has_permissions.forEach(p => {
                has_permissions_translate.push(language[p]);
            });

            if (client.user.id == collector_member.user.id) {
                const permissionFlags = client.config.bot.permissionID;
                const allPermissions = new PermissionsBitField(BigInt(permissionFlags));
                const clientPermissions = allPermissions.toArray();
                const missing = [];
                clientPermissions.forEach(i => {
                    if (!collector_member.permissions.has(i))
                        missing.push(language[i]);
                });
                let hasPerm = (has_permissions_translate.length != 0);
                let hasMiss = (missing.length != 0);
                // client.console('Log', hasPerm + ' ' + hasMiss);
                embed = new EmbedBuilder()
                    .setTitle('成員資訊')
                    .setDescription('權限')
                    .setAuthor({
                        name: `${collector_member.nickname ?
                            collector_member.nickname + ' (' + collector_member.user.tag + ')'
                            : collector_member.user.tag}`,
                        iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${collector_member.user.id}` })
                    .setColor(collector_member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '權限 (如果缺少將會嚴重影響機器人的運作！)',
                            value: `\`\`\`diff\n${hasPerm ? '+ ' + has_permissions_translate.join('\n+ ') : ''}\n${hasMiss != [] ? '- ' + missing.join('\n- ') : ''}\`\`\``,
                            inline: true,
                        },
                    );

            } else {
                embed = new EmbedBuilder()
                    .setTitle('成員資訊')
                    .setDescription('權限')
                    .setAuthor({
                        name: `${collector_member.nickname ?
                            collector_member.nickname + ' (' + collector_member.user.tag + ')'
                            : collector_member.user.tag}`,
                        iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${collector_member.user.id}` })
                    .setColor(collector_member.displayHexColor)
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
            if (client.user.id == collector_member.user.id) {
                const os = require('os');
                const version = require('../../../../../package.json').version;
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

                const whatIsNew_file = readFileSync('WhatIsNew.md', 'utf-8')
                content = `${whatIsNew_file}`;
                //
                embed = new EmbedBuilder()
                    .setTitle('成員資訊')
                    .setDescription('其他')
                    .setAuthor({
                        name: `${collector_member.nickname ?
                            collector_member.nickname + ' (' + collector_member.user.tag + ')'
                            : collector_member.user.tag}`,
                        iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${collector_member.user.id}` })
                    .setColor(collector_member.displayHexColor)
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
                embed = new EmbedBuilder()
                    .setTitle('成員資訊')
                    .setDescription('其他')
                    .setAuthor({
                        name: `${collector_member.nickname ?
                            collector_member.nickname + ' (' + collector_member.user.tag + ')'
                            : collector_member.user.tag}`,
                        iconURL: `${collector_member.user.displayAvatarURL({ dynamic: true }) || collector_member.user.avatarURL({ dynamic: true }) || collector_member.user.defaultAvatarURL}`,
                    })
                    .setFooter({ text: `ID: ${collector_member.user.id}` })
                    .setColor(collector_member.displayHexColor)
                    .setTimestamp()
                    .addFields(
                        {
                            name: '頭像連結',
                            value: `[點我](${collector_member.displayAvatarURL({ dynamic: true, size: 1024 })
                                || collector_member.avatarURL({ dynamic: true, size: 1024 })
                                || collector_member.user.defaultAvatarURL})`,
                            inline: true,
                        },
                        {
                            name: '橫幅連結',
                            value: `${collector_member.user.banner ? `[點我](${collector_member.user.bannerURL({ dynamic: true, size: 1024 })})` : '沒有橫幅'}`,
                            inline: true,
                        },
                    );
            }
        }

        // 編輯訊息
        collector_interaction.update({
            embeds: [embed],
            content,
        });
    },
    );
}