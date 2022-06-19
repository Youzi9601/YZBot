const moment = require('moment');
const chalk = require('chalk');
const { config } = require('../../../../bot');
const { SlashCommandBuilder } = require('@discordjs/builders');

//
module.exports = {
    command: new SlashCommandBuilder()
        .setName('developers')
        .setNameLocalizations({
            "zh-TW": '開發者功能'
        })
        .setDescription('機器人的危險設定')
        .setDescriptionLocalizations({
            "zh-TW": "開發者專用的危險設定"
        })
        .addSubcommandGroup(g =>
            g
                .setName('guild')
                .setNameLocalizations({ "zh-TW": "伺服器" })
                .setDescription('伺服器相關')
                .setDescriptionLocalizations({ "zh-TW": '伺服器相關設定' })
                .addSubcommand(c =>
                    c
                        .setName('list')
                        .setNameLocalizations({ 'zh-TW': '列表' })
                        .setDescription('將機器人所在的所有服務器列出於控制台')
                        .setDescriptionLocalizations({ 'zh-TW': '將此伺服器所在的機器人地區之所有伺服器列出於控制台' })
                )
                .addSubcommand(c =>
                    c
                        .setName('create-invite')
                        .setNameLocalizations({ 'zh-TW': '邀請' })
                        .setDescription('讓機器人生成特定伺服器的邀請')
                        .setDescriptionLocalizations({ 'zh-TW': '讓機器人生成特定伺服器的邀請' })
                        .addStringOption(s =>
                            s
                                .setName('id')
                                .setDescription('伺服器ID')
                                .setRequired(true)
                        )
                )
                .addSubcommand(c =>
                    c
                        .setName('leave')
                        .setNameLocalizations({ 'zh-TW': '離開' })
                        .setDescription('讓機器人離開伺服器')
                        .setDescriptionLocalizations({ 'zh-TW': '讓機器人離開伺服器' })
                        .addStringOption(s =>
                            s
                                .setName('id')
                                .setDescription('伺服器ID')
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(g =>
            g
                .setName('client')
                .setNameLocalizations({ "zh-TW": "客戶端" })
                .setDescription('機器人客戶端')
                .setDescriptionLocalizations({ "zh-TW": '機器人客戶端控制' })
                .addSubcommand(c =>
                    c
                        .setName('exit')
                        .setNameLocalizations({ 'zh-TW': '關機' })
                        .setDescription('將機器人關機')
                        .setDescriptionLocalizations({ 'zh-TW': '將機器人關機' })
                )
                .addSubcommand(c =>
                    c
                        .setName('reset-commands')
                        .setNameLocalizations({ 'zh-TW': '重置命令' })
                        .setDescription('將命令全部重新刷新')
                        .setDescriptionLocalizations({ 'zh-TW': '重新刷新全部命令' })
                )
        )
        .toJSON(),

    ownerOnly: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        let subcommandGroup = ''
        try {
            subcommandGroup = interaction.options.getSubcommandGroup();
        } catch (error) {
            // 沒有群組指令
        }

        if (!subcommandGroup) {
            //
        }
        else {
            if (subcommandGroup == 'guild') {
                if (subcommand == 'list') {
                    const { MessageEmbed } = require('discord.js');
                    let i = 1;
                    let page = 1;
                    const embed = [];
                    let field = [];
                    client.guilds.cache.forEach(
                        /** @param {import('discord.js').Guild} guild */
                        (guild) => {

                            if (Math.round(i / 20) == i / 20) {
                                embed.push(
                                    new MessageEmbed()
                                        .setTitle(`第${page}頁`)
                                        .addFields(field)
                                        .setColor('WHITE'),
                                );
                                field = [];
                                page++;
                            }
                            field.push(
                                {
                                    name: `${i}. ${guild.name} (${guild.id})`,
                                    value: [
                                        ` 所有者 ${guild.ownerId}`,
                                        `總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size}人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                                    ].join('\n'),
                                    inline: true,
                                },
                            );


                            console.info(
                                chalk.gray(
                                    `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                                ) +
                                chalk.gray('└ ') +
                                `${guild.name} | ${guild.id} | 所有者 ${guild.ownerId
                                } \n                        └ 總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size
                                }人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                            );

                            i++;
                        });

                    if (field != []) {
                        embed.push(
                            new MessageEmbed()
                                .setTitle(`第${page}頁`)
                                .addFields(field)
                                .setColor('WHITE'),
                        );
                    }

                    // 發送訊息
                    const msg = new container.Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTimestamp()
                        .setAuthor({
                            name: interaction.member.user.tag,
                            iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                        })
                        .setDescription('伺服器列表已列於控制台！');
                    // 添加到最前端
                    embed.unshift(msg);
                    interaction.reply({
                        embeds: embed,
                        allowedMentions: {
                            repliedUser: false,
                        },
                        ephemeral: true,
                    });
                    // interaction.channel.send({ embeds: embed })
                }
                else if (subcommand == 'create-invite') {
                    const id = interaction.options.getString('id');
                    const guild = client.guilds.cache.get(id);
                    const owner = guild.members.cache.get(guild.ownerId);

                    try {

                        let invite_channel = guild.systemChannel;

                        if (guild.systemChannel) {
                            invite_channel = guild.systemChannel;
                        } else if (guild.rulesChannel) {
                            invite_channel = guild.rulesChannel;
                        } else {
                            invite_channel = guild.channels.cache.filter(c => c.type == 'GUILD_TEXT' && c.nsfw == false && c.permissionsFor(client.user.id).has('SEND_MESSAGES') || c.type == 'GUILD_TEXT' && c.name.includes('聊天' || '說話') && c.permissionsFor(client.user.id).has('SEND_MESSAGES'))[0];
                        }


                        await invite_channel
                            .createInvite({ unique: true, maxAge: 0, maxUses: 0 })
                            .then((invite) => {
                                const invite_code = invite.code;
                                // 進退變動 加入
                                interaction.reply(
                                    '```diff' +
                                    `\n+ 機器人邀請已生成！ ${guild.name} (${guild.id}) (擁有者： ${owner.user.tag} ${guild.ownerId}) ` +
                                    '\n```' +
                                    `https://discord.gg/${invite_code}`,
                                );
                            });
                        // end

                    } catch (err) {
                        interaction.reply({ content: `生成邀請時發生錯誤： \`${err.message}\`` });
                    }
                }
                else if (subcommand == 'leave') {
                    const id = interaction.options.getString('id');
                    const guild = client.guilds.cache.get(id);
                    try {
                        if (!guild) {
                            return interaction.reply({ content: '未指定伺服器 ID。請指定伺服器ID' });
                        }

                        await guild.leave();
                        interaction.reply({ content: `成功離開 **${guild.name}**，少了\`${guild.memberCount}\`位成員。` });
                    } catch (err) {
                        interaction.reply({ content: `離開伺服器時發生錯誤： \`${err.message}\`` });
                    }
                }

            }
            else if (subcommandGroup == 'client') {
                if (subcommand == 'edit') {
                    client.user.setPresence({
                        activities: [
                            {
                                name: `${client.user.username} 關機中...`,
                                type: 'LISTENING',
                                // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                            },
                        ],
                        // browser: 'DISCORD IOS',
                        status: 'idle', // 還在關機
                    });
                    const humanizeDuration = require('humanize-duration');
                    await interaction.reply({ content: '關閉機器人......' });

                    /** */


                    console.log('\n\n關機｜收到 關閉 信號，關閉機器人......');
                    console.log(
                        chalk.gray(
                            '───────────────────────────────機器人控制台───────────────────────────────\n',
                        ),
                    );
                    const { oldmsg, message } = require('../../../Plugins/discord/client/ReadyUpdater');
                    // 調整時差
                    const Today = new Date();
                    let day = Today.getDate();
                    let hours = Today.getUTCHours() + config.GMT;

                    if (hours >= 24) {
                        hours = hours - 24;
                        day = day + 1;
                    }

                    const msg = '```' +
                        Today.getFullYear() +
                        ' 年 ' +
                        (Today.getMonth() + 1) +
                        ' 月 ' +
                        day +
                        ' 日 ' +
                        hours +
                        ' 時 ' +
                        Today.getMinutes() +
                        ' 分 ' +
                        Today.getSeconds() +
                        ' 秒' +
                        ' 機器人關機```';
                    const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                        conjunction: ' ',
                        language: 'zh_TW',
                    })} `;
                    const embed = {
                        color: 0x808080,
                        description: oldmsg + ' ' + msg,
                        author: {
                            name: `${client.user.username} - 機器人運作資訊`,
                            iconURL: client.user.avatarURL({ dynamic: true }),
                        },
                        fields: [
                            { name: '版本:', value: `v${require('./../../../../package.json').version}`, inline: true },
                            { name: 'Discord.js:', value: `${require('discord.js').version}`, inline: true },
                            { name: 'Node.js', value: `${process.version}`, inline: true },
                            { name: '\u200B', value: '\u200B', inline: false },
                            {
                                name: '運行時間:',
                                value: `${uptime}`,
                                inline: true,
                            },
                        ],
                        timestamp: new Date(),
                    };
                    try {
                        await message.edit({ embeds: [embed] });
                    } catch (error) { }

                    client.user.setPresence({
                        activities: [
                            {
                                name: `暫停服務 - ${client.user.username}`,
                                type: 'LISTENING',
                                // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                            },
                        ],
                        // browser: 'DISCORD IOS',
                        status: 'dnd',
                        afk: true,
                    });

                    const sleep = async (ms) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                            }, ms || 0);
                        });
                    };
                    await sleep(1000);

                    /** */
                    process.exit(0);
                }
                else if (subcommand == 'reset-commands') {
                    require('./../../../../reset');
                    const sleep = async (ms) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                            }, ms || 0);
                        });
                    };
                    await sleep(120000); // 休息

                    const path = __dirname;
                    const Handler = require('./../../../Structures/Handlers/Handler');
                    await Handler.loadMessageCommands(client, path);

                    await Handler.loadSlashCommands(client, path);

                    await Handler.loadContextMenus(client, path);

                    await Handler.loadButtonCommands(client, path);

                    await Handler.loadSelectMenus(client, path);

                    await Handler.loadModals(client, path);


                }
            }
        }
        // #region list-servers
        if (subcommand == 'list-servers') {
            const { MessageEmbed } = require('discord.js');
            let i = 1;
            let page = 1;
            const embed = [];
            let field = [];
            client.guilds.cache.forEach(
                /** @param {import('discord.js').Guild} guild */
                (guild) => {

                    if (Math.round(i / 20) == i / 20) {
                        embed.push(
                            new MessageEmbed()
                                .setTitle(`第${page}頁`)
                                .addFields(field)
                                .setColor('WHITE'),
                        );
                        field = [];
                        page++;
                    }
                    field.push(
                        {
                            name: `${i}. ${guild.name} (${guild.id})`,
                            value: [
                                ` 所有者 ${guild.ownerId}`,
                                `總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size}人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                            ].join('\n'),
                            inline: true,
                        },
                    );


                    console.info(
                        chalk.gray(
                            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                        ) +
                        chalk.gray('└ ') +
                        `${guild.name} | ${guild.id} | 所有者 ${guild.ownerId
                        } \n                        └ 總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size
                        }人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                    );

                    i++;
                });

            if (field != []) {
                embed.push(
                    new MessageEmbed()
                        .setTitle(`第${page}頁`)
                        .addFields(field)
                        .setColor('WHITE'),
                );
            }

            // 發送訊息
            const msg = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setDescription('伺服器列表已列於控制台！');
            // 添加到最前端
            embed.unshift(msg);
            interaction.reply({
                embeds: embed,
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
            // interaction.channel.send({ embeds: embed })
        }
        // #endregion

        // #region leave-server
        else if (subcommand == 'leave-server') {
            const id = interaction.options.getString('id');
            const guild = client.guilds.cache.get(id);
            try {
                if (!guild) {
                    return interaction.reply({ content: '未指定伺服器 ID。請指定伺服器ID' });
                }

                await guild.leave();
                interaction.reply({ content: `成功離開 **${guild.name}**，少了\`${guild.memberCount}\`位成員。` });
            } catch (err) {
                interaction.reply({ content: `離開伺服器時發生錯誤： \`${err.message}\`` });
            }
        }
        // #endregion
        // #region create-invite
        else if (subcommand == 'create-server-invite') {
            const id = interaction.options.getString('id');
            const guild = client.guilds.cache.get(id);
            const owner = guild.members.cache.get(guild.ownerId);

            try {

                let invite_channel = guild.systemChannel;

                if (guild.systemChannel) {
                    invite_channel = guild.systemChannel;
                } else if (guild.rulesChannel) {
                    invite_channel = guild.rulesChannel;
                } else {
                    invite_channel = guild.channels.cache.filter(c => c.type == 'GUILD_TEXT' && c.nsfw == false && c.permissionsFor(client.user.id).has('SEND_MESSAGES') || c.type == 'GUILD_TEXT' && c.name.includes('聊天' || '說話') && c.permissionsFor(client.user.id).has('SEND_MESSAGES'))[0];
                }


                await invite_channel
                    .createInvite({ unique: true, maxAge: 0, maxUses: 0 })
                    .then((invite) => {
                        const invite_code = invite.code;
                        // 進退變動 加入
                        interaction.reply(
                            '```diff' +
                            `\n+ 機器人邀請已生成！ ${guild.name} (${guild.id}) (擁有者： ${owner.user.tag} ${guild.ownerId}) ` +
                            '\n```' +
                            `https://discord.gg/${invite_code}`,
                        );
                    });
                // end

            } catch (err) {
                interaction.reply({ content: `生成邀請時發生錯誤： \`${err.message}\`` });
            }
        }
        // #endregion
        // #region exit
        else if (subcommand == 'exit') {
            client.user.setPresence({
                activities: [
                    {
                        name: `${client.user.username} 關機中...`,
                        type: 'LISTENING',
                        // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                    },
                ],
                // browser: 'DISCORD IOS',
                status: 'idle', // 還在關機
            });
            const humanizeDuration = require('humanize-duration');
            await interaction.reply({ content: '關閉機器人......' });

            /** */


            console.log('\n\n關機｜收到 關閉 信號，關閉機器人......');
            console.log(
                chalk.gray(
                    '───────────────────────────────機器人控制台───────────────────────────────\n',
                ),
            );
            const { oldmsg, message } = require('../../../Plugins/discord/client/ReadyUpdater');
            // 調整時差
            const Today = new Date();
            let day = Today.getDate();
            let hours = Today.getUTCHours() + config.GMT;

            if (hours >= 24) {
                hours = hours - 24;
                day = day + 1;
            }

            const msg = '```' +
                Today.getFullYear() +
                ' 年 ' +
                (Today.getMonth() + 1) +
                ' 月 ' +
                day +
                ' 日 ' +
                hours +
                ' 時 ' +
                Today.getMinutes() +
                ' 分 ' +
                Today.getSeconds() +
                ' 秒' +
                ' 機器人關機```';
            const uptime = `${humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                conjunction: ' ',
                language: 'zh_TW',
            })} `;
            const embed = {
                color: 0x808080,
                description: oldmsg + ' ' + msg,
                author: {
                    name: `${client.user.username} - 機器人運作資訊`,
                    iconURL: client.user.avatarURL({ dynamic: true }),
                },
                fields: [
                    { name: '版本:', value: `v${require('./../../../../package.json').version}`, inline: true },
                    { name: 'Discord.js:', value: `${require('discord.js').version}`, inline: true },
                    { name: 'Node.js', value: `${process.version}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: false },
                    {
                        name: '運行時間:',
                        value: `${uptime}`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            };
            try {
                await message.edit({ embeds: [embed] });
            } catch (error) { }

            client.user.setPresence({
                activities: [
                    {
                        name: `暫停服務 - ${client.user.username}`,
                        type: 'LISTENING',
                        // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                    },
                ],
                // browser: 'DISCORD IOS',
                status: 'dnd',
                afk: true,
            });

            const sleep = async (ms) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, ms || 0);
                });
            };
            await sleep(1000);

            /** */
            process.exit(0);
        }
        // #endregion
        // #region reload commands
        else if (subcommand == 'reset-commands') {
            require('./../../../../reset');
            const sleep = async (ms) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, ms || 0);
                });
            };
            await sleep(120000); // 休息

            const path = __dirname;
            const Handler = require('./../../../Structures/Handlers/Handler');
            await Handler.loadMessageCommands(client, path);

            await Handler.loadSlashCommands(client, path);

            await Handler.loadContextMenus(client, path);

            await Handler.loadButtonCommands(client, path);

            await Handler.loadSelectMenus(client, path);

            await Handler.loadModals(client, path);


        }
        // #endregion
    },
};
