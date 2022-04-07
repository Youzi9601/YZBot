(async () => {
    // #region 啟動設定
    const moment = require('moment');
    const fs = require('fs');
    const Discord = require('discord.js');
    const {
        // Collection,
        Client,
        Intents,
        // Formatters,
        MessageActionRow,
        MessageButton,
        MessageEmbed,
        MessageSelectMenu,
    } = require('discord.js');
    const { REST } = require("@discordjs/rest")
    const { Routes } = require("discord-api-types/v9")
    const config = require('./Config');
    const path = __dirname;
    const client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_PRESENCES,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_INVITES,
            Discord.Intents.FLAGS.GUILD_BANS,
        ],
        partials: ['CHANNEL'],
        ws: { properties: { $browser: 'Discord iOS' } },
    });

    const { Player } = require("discord-player")
    client.slashcommands = new Discord.Collection()
    client.player = new Player(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1 << 25
        }
    })
    const chalk = require('chalk');

    exports.client = client;
    exports.path = path;
    exports.config = config;
    /**
   *
   * 運轉
   * [${moment().format("YYYY-MM-DD HH:mm:ss")}] 為時間截
   */
    /**
   * 清除
   */
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取運轉文件...(可能需要花上很多時間)',
    );
    client.commands = {};
    client.events = new Discord.Collection();
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();

    updater();
    // 檢查機器人更新
    function updater() {

        var AutoUpdater = require('auto-updater');

        var autoupdater = new AutoUpdater({
            pathToJson: '',
            autoupdate: config.autoupdate,
            checkgit: true,
            jsonhost: 'raw.githubusercontent.com',
            contenthost: 'codeload.github.com',
            progressDebounce: 0,
            devmode: false
        });

        // 陳述事件
        autoupdater.on('git-clone', function () {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "您有一個git-clone，我們推薦你使用。使用'git pull'更新到最新版本！");
        });
        autoupdater.on('check.up-to-date', function (v) {
            console.info(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "您擁有最新版本： " + v);
        });
        autoupdater.on('check.out-dated', function (v_old, v) {
            console.warn(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "您的版本已過時。 您的版本：" + v_old + " 最新版本：" + v);
            autoupdater.fire('download-update'); // 如果 autoupdate: false，您必須手動執行此操作。
            // 也許會問是否願意下載更新。
        });
        autoupdater.on('update.downloaded', function () {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "更新已下載並準備安裝");
            autoupdater.fire('extract'); // 如果 autoupdate: false，您必須手動執行此操作。
        });
        autoupdater.on('update.not-installed', function () {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "更新已在您的文件夾中！已讀取安裝");
            autoupdater.fire('extract'); // 如果 autoupdate: false，您必須手動執行此操作。
        });
        autoupdater.on('update.extracted', function () {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "更新提取成功！");
            console.warn(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "重啟機器人！");
        });
        autoupdater.on('download.start', function (name) {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "開始下載： " + name);
        });
        autoupdater.on('download.progress', function (name, perc) {
            process.stdout.write(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "下載中... " + perc + "% \033[0G");
        });
        autoupdater.on('download.end', function (name) {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "已下載！ " + name);
        });
        autoupdater.on('download.error', function (err) {
            console.error(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "下載時出現了錯誤： " + err);
        });
        autoupdater.on('end', function () {
            console.log(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + "該應用程序已準備好運行！");
        });
        autoupdater.on('error', function (name, e) {
            console.error(chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + name, e);
        });

        // 開始檢查更新
        autoupdater.fire('check');
    }
    // 執行讀取
    const Handler = require(`${path}/Root/Structures/Handlers/Handler`);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取事件觸發...',
    );
    await Handler.loadEvents(client);

    // 執行登入
    const ci = process.env.CI;
    if (ci === 'true') console.log(chalk.gray(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
    ) + chalk.red('CI測試事件> ') + 'CI測試進行中...');
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '機器人檔案讀取中...',
    );
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '取得Token中...',
    );

    if (!config.token) {
        console.error(
            chalk.bgRed(
                '沒有找到 token! 請在 config.js 中輸入您的token!\n請訪問：https://discord.com/developers/application 獲取token',
            ),
        );
        process.exit(0);
    }
    await client.login(config.token);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + chalk.white(`成功使用 ${client.user.tag} 登入!`),
    );
    // 執行登入命令
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取訊息命令...',
    );
    await Handler.loadMessageCommands(client, path);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '載入斜線命令...',
    );
    await Handler.loadSlashCommands(client, path);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '載入互動選單...',
    );
    await Handler.loadContextMenus(client, path);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取按鈕交互...',
    );
    await Handler.loadButtonCommands(client, path);
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取選單交互...',
    );
    await Handler.loadSelectMenus(client, path);

    // 處理網頁
    await require('./Root/Plugins/web/web.js')(client)
    //

    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + chalk.green('完成讀取！'),
    );
    // #endregion 
    // #region 事件
    // 錯誤事件抓取
    if (config.console.error) {
        client.on('error', (e) => {
            console.error(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR\n`) + `${e}`)
            fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR｜${e}`, function (err) {
                if (err)
                    console.log(err)
            })

            // 發送回報
            const reportChannel = client.channels.cache.get(
                config.Channels.reportChannel,
            );
            reportChannel.send({
                content: `<@!${require('Config.js').ownerId}>`,
                embeds: [new MessageEmbed()
                    .setTitle(`${e.name} 錯誤！`)
                    .setDescription(`錯誤訊息：${e.message}`)
                    .setFields({
                        name: '出現位置',
                        value:
                            e?.fileName
                                ? `${e?.fileName}${e?.lineNumber
                                    ? `:${e?.lineNumber}${e?.columnNumber
                                        ? `:${e?.columnNumber}`
                                        : ''}`
                                    : ''}`
                                : '沒有這種東西',
                    }),
                ],
            });

        }
        );

    }
    if (config.console.warn) {
        client.on('warn', (e) => {
            console.warn(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN\n`) + `${e}`)
            fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN｜${e}`, function (err) {
                if (err)
                    console.log(err)
            })
        });
    }
    if (config.console.debug) {
        client.on('debug', (e) => {
            console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] DEBUG\n`) + `${e}`)
            fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] DEBUG｜${e}`, function (err) {
                if (err)
                    console.log(err)
            })
        });
    }

    /**
   * 特殊事件執行
   */
    /**
   *
   * 伺服器進退
   *
   */
    // 新增
    client.on('guildCreate', async (guild) => {
        console.log(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) +
            chalk.green('進退變動 > ') +
            `加入 ${guild.name}`,
        );

        client.user.setPresence({
            activities: [
                {
                    name: `${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者`,
                },
            ],
            status: `${config.botPresence.status}`,
        });

        // console 頻道
        const invitechannel = client.channels.cache.get(
            config.Channels.inviteChannel,
        );
        /** 設定加入訊息 Home*/
        const invitemsg_embed = new MessageEmbed()
            .setColor(0xe4fff6)
            .setTitle(`${config.botName}`)
            .setDescription(`感謝您邀請${config.botName}到您的伺服器`)
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: '使用 [ / ] 呼叫斜線指令',
                    value: '或使用 `/help` 獲取機器人的指令列表',
                },
                {
                    name: '如果有任何問題',
                    value: `您可以到 [支援伺服器](https://discord.gg/${config.invite_code}) 來找我們喔！`,
                },
            )
            .setFooter({
                text: `${config.botName}`,
                iconURL: `${client.user.displayAvatarURL()}`,
            });
        const invitemsg_button = new MessageButton()
            .setLabel('加入伺服器')
            .setStyle('LINK')
            .setURL(`https://discord.gg/${config.invite_code}`)
            .setDisabled(false);

        // 合併Components
        const row = new MessageActionRow().addComponents(invitemsg_button);
        /** 設定加入訊息 End*/
        if (!guild.systemChannel) return;
        guild.systemChannel.sendTyping();
        await guild.systemChannel.send({
            embeds: [invitemsg_embed],
            components: [row],
        });

        await guild.systemChannel
            .createInvite({ unique: true, maxAge: 0, maxUses: 0 })
            .then((invite) => {
                const invite_code = invite.code;
                // 進退變動 加入
                invitechannel.send(
                    '```diff' +
                    `\n+ 機器人已加入：${guild.name}` +
                    '\n```' +
                    `https://discord.gg/${invite_code}`,
                );
            });
    });
    // 刪除
    client.on('guildDelete', async (guild) => {
        console.log(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) +
            chalk.green('進退變動 > ') +
            `離開 ${guild.name}`,
        );
        client.user.setPresence({
            activities: [
                {
                    name: `${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者`,
                },
            ],
            status: `${config.botPresence.status}`,
        });

        // console 頻道
        const invitechannel = client.channels.cache.get(
            config.Channels.inviteChannel,
        );
        // 進退變動 離開
        invitechannel.send('```diff' + `\n- 機器人已離開：${guild.name}` + '\n```');
    });

    /**
   * 特殊事件執行 (End)
   */
    process.on('unhandledRejection', error => {
        console.error('ERROR｜未處理的承諾拒絕：\n', error);
    });
    // #endregion

})();

