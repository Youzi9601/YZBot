const moment = require('moment');
const chalk = require('chalk');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

//
module.exports = {
    data: new SlashCommandBuilder()
        .setName('developers')
        .setNameLocalizations({
            "zh-TW": '開發者功能',
        })
        .setDescription('機器人的危險設定')
        .setDescriptionLocalizations({
            "zh-TW": "開發者專用的危險設定",
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
                        .setDescriptionLocalizations({ 'zh-TW': '將此伺服器所在的機器人地區之所有伺服器列出於控制台' }),
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
                                .setRequired(true),
                        ),
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
                                .setRequired(true),
                        ),
                )
                .addSubcommand(c =>
                    c
                        .setName('shout-out')
                        .setNameLocalizations({ 'zh-TW': '發布' })
                        .setDescription('讓機器人將訊息發布給每位伺服器的所有者。')
                        .setDescriptionLocalizations({ 'zh-TW': '讓機器人將訊息發布給每位伺服器的所有者。' })
                        .addStringOption(s =>
                            s
                                .setName('title')
                                .setDescription('標題')
                                .setRequired(true),
                        )
                        .addStringOption(s =>
                            s
                                .setName('text')
                                .setDescription('要發布的內容')
                                .setRequired(true),
                        ),
                ),
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
                        .setDescriptionLocalizations({ 'zh-TW': '將機器人關機' }),
                )
                .addSubcommand(c =>
                    c
                        .setName('reset-commands')
                        .setNameLocalizations({ 'zh-TW': '重置命令' })
                        .setDescription('將命令全部重新刷新')
                        .setDescriptionLocalizations({ 'zh-TW': '重新刷新全部命令' }),
                ),
        )
        .toJSON(),
    type: ['Developers'],
    OnlyRunOnGuilds: true,
    ownerOnly: true,
    disabled: false, // 記得改成false再來執行這側是

    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, config, db) => {
        const subcommand = interaction.options.getSubcommand();
        let subcommandGroup = '';
        try {
            subcommandGroup = interaction.options.getSubcommandGroup();
        } catch (error) {
            // 沒有群組指令
        }

        if (!subcommandGroup) {
            //
        } else if (subcommandGroup == 'guild') {
            if (subcommand == 'list') {

                // #region
                try {

                    const embeds = [];
                    let k = 10;
                    const guilds = client.guilds.cache.map(g => {
                        return {
                            name: g.name,
                            id: g.id,
                            memberCount: g.memberCount,
                            member: g.members.cache.filter((m) => !m.user.bot).size,
                            bot: g.members.cache.filter((m) => m.user.bot).size,
                        };
                    });
                    // defining each Pages
                    for (let i = 0; i < guilds.length; i += 10) {
                        const qus = guilds;
                        const current = qus.slice(i, k);
                        let j = i + 1;
                        const info = current.map((g) => `**${ j++ }.** \n\`\`\`${ String(g.name) } ( ${ g.id } )\n>  ${ g.memberCount }人(${ g.member }真人/${ g.bot }機器人)\`\`\` `).join('\n');
                        const embed = new EmbedBuilder()
                            .setFooter({
                                text: client.user.username,
                                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                            })
                            .setTimestamp()
                            .setColor(0x0098d9)
                            .setDescription(`${ info }`);
                        if (i < 10) {
                            embed.setTitle(`📑 **伺服器列表**`);
                            embed.setDescription(`${ info }`);
                        }
                        embeds.push(embed);
                        k += 10; // Raise k to 10
                    }
                    embeds[embeds.length - 1] = embeds[embeds.length - 1]
                        .setFooter(
                            {
                                text: `\n${ guilds.length } 個伺服器`,
                            },
                        );
                    let pages = [];
                    for (let i = 0; i < embeds.length; i += 3) {
                        pages.push(embeds.slice(i, i + 3));
                    }
                    pages = pages.slice(0, 24);
                    const Menu = new StringSelectMenuBuilder()
                        .setCustomId('SERVERPAGES')
                        .setPlaceholder('選擇一個頁碼')
                        .addOptions(
                            pages.map((page, index) => {
                                const Obj = {};
                                Obj.label = `第 ${ index + 1 } 頁`;
                                Obj.value = `${ index }`;
                                Obj.description = `第 ${ index + 1 }/${ pages.length } 頁！`;
                                return Obj;
                            }),
                        );
                    const row = new ActionRowBuilder().addComponents([Menu]);
                    interaction.reply({
                        embeds: [embeds[0]],
                        components: [row],
                    });
                    // Event
                    client.on('interactionCreate', (i) => {
                        if (!i.isStringSelectMenu()) return;
                        if (i.customId === 'SERVERPAGES' && i.applicationId == client.user.id) {
                            i.update({
                                embeds: pages[Number(i.values[0])],
                            }).catch(e => { });
                        }
                    });
                } catch (e) {
                    client.console('Log', undefined, undefined, undefined, e.stack ? e.stack : e);
                    interaction.reply({
                        content: '錯誤: ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xf24e43)
                                .setDescription(`\`\`\`${ e }\`\`\``)
                                .setFooter({
                                    text: client.user.username,
                                    iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                                })
                                .setTimestamp(),
                        ],

                    });
                }
                // #endregion


            } else if (subcommand == 'create-invite') {
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
                                `\n+ 機器人邀請已生成！ ${ guild.name } (${ guild.id }) (擁有者： ${ owner.user.tag } ${ guild.ownerId }) ` +
                                '\n```' +
                                `https://discord.gg/${ invite_code }`,
                            );
                        });
                    // end

                } catch (err) {
                    interaction.reply({ content: `生成邀請時發生錯誤： \`${ err.message }\`` });
                }
            } else if (subcommand == 'leave') {
                const id = interaction.options.getString('id');
                const guild = client.guilds.cache.get(id);
                try {
                    if (!guild) {
                        return interaction.reply({ content: '未指定伺服器 ID。請指定伺服器ID' });
                    }

                    await guild.leave();
                    interaction.reply({ content: `成功離開 **${ guild.name }**，少了\`${ guild.memberCount }\`位成員。` });
                } catch (err) {
                    interaction.reply({ content: `離開伺服器時發生錯誤： \`${ err.message }\`` });
                }
            } else if (subcommand == 'shout-out') {
                const title = interaction.options.getString('title') || '開發者通知';
                const text = (await interaction.options.getString('text')).replace(/\\n/g, '\n');
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setColor(0x0098d9)
                    .setDescription(text)
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL:
                            interaction.user.avatarURL() ||
                            interaction.user.defaultAvatarURL,
                    })
                    .setFooter({
                        iconURL:
                            interaction.client.user.avatarURL() ||
                            interaction.client.user.defaultAvatarURL,
                        text: interaction.client.user.username,
                    });

                client.shard.broadcastEval(async (c, { embed_msg }) => {
                    const guilds = c.guilds.cache;
                    guilds.forEach(async (g) => {
                        const ownerid = g.ownerId;
                        const user = c.users.cache.get(ownerid);
                        // 設定嵌入訊息
                        embed_msg.footer.text = `給 ${ g.name } 的擁有者`;
                        if (g.iconURL())
                            embed_msg.footer.icon_url = g.iconURL();
                        // 創建私信
                        await user.createDM()
                            .then(async (dm) => {
                                await dm.sendTyping();
                                await dm.send({ embeds:[embed_msg] });
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    });

                }, { context: { embed_msg: embed } })
                    .then(async _ => {
                        return interaction.reply({ content: "訊息已發送：\n" + text });
                    });


            }

        } else if (subcommandGroup == 'client') {
            if (subcommand == 'exit') {
                client.user.setPresence({
                    activities: [
                        {
                            name: `${ client.user.username } 關機中...`,
                            type: 'LISTENING',
                            // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                        },
                    ],
                    // browser: 'DISCORD IOS',
                    status: 'idle', // 還在關機
                });
                const humanizeDuration = require('humanize-duration');
                await interaction.reply({ content: '關閉機器人......' });
                client.user.setPresence({
                    activities: [
                        {
                            name: `暫停服務 - ${ client.user.username }`,
                            type: 'LISTENING',
                            // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                        },
                    ],
                    // browser: 'DISCORD IOS',
                    status: 'dnd',
                    afk: true,
                });
                /** */


                client.console('Log', '\n\n關機｜收到 關閉 信號，關閉機器人......');
                client.console('Log',
                    chalk.gray(
                        '───────────────────────────────機器人控制台───────────────────────────────\n',
                    ),
                );
                const { timer_msg, message } = require('../../../events/Client/bot/status');
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
                const uptime = `${ humanizeDuration((Math.round(client.uptime / 1000) * 1000), {
                    conjunction: ' ',
                    language: 'zh_TW',
                }) } `;
                const embed = {
                    color: 0x808080,
                    description: timer_msg + ' ' + msg,
                    author: {
                        name: `${ client.user.username } - 機器人運作資訊`,
                        iconURL: client.user.avatarURL({ dynamic: true }),
                    },
                    fields: [
                        { name: '版本:', value: `v${ require('../../../../package.json').version }`, inline: true },
                        { name: 'Discord.js:', value: `${ require('discord.js').version }`, inline: true },
                        { name: 'Node.js', value: `${ process.version }`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: false },
                        {
                            name: '運行時間:',
                            value: `${ uptime }`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                };
                try {
                    await message.edit({ embeds: [embed] });
                } catch (error) {
                    client.console('Error', undefined, undefined, undefined, error);
                }


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
            } else if (subcommand == 'reset-commands') {
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
    },
};