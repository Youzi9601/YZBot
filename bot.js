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
    // #region 網頁
    /**
     * 
     * 網頁
     * 
     */

    //#region 網站


        let DBD = require('discord-dashboard');

        const DarkDashboard = require('dbd-dark-dashboard');
        let web = {}
        let langsSettings = {}
        let embedjoin = {}

        await DBD.useLicense(`${config.License_ID}`);
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            noCreateServer: config.web,
            acceptPrivacyPolicy: true,
            minimizedConsoleLogs: true,


            port: 80,
            client: {
                id: `${config.clientID}`,
                secret: `${config.clientSECRET}`
            },
            redirectUri: 'http://localhost/discord/callback',
            domain: 'http://localhost',
            bot: client,
            theme: DarkDashboard({
                information: {
                    createdBy: `${config.botName}`,
                    websiteTitle: `${config.botName} 機器人設定網頁`,
                    websiteName: `${config.botName}`,
                    websiteUrl: "https:/www.youzi-tw.tk",
                    dashboardUrl: "http://localhost:3000/",
                    supporteMail: "yoyowu9601.tw@gmail.com",
                    supportServer: `https://discord.gg/${config.invite_code}`,
                    imageFavicon: `${client.user.displayAvatarURL()}`,
                    iconURL: `${client.user.displayAvatarURL()}`,
                    pageBackGround: "linear-gradient(#2CA8FF, #155b8d)",
                    loggedIn: "登錄成功！",
                    mainColor: "#29FB77",
                    subColor: "#187AFD",
                    preloader: "正在加載..."
                },
                popupMsg: {
                    savedSettings: "變更已儲存！",
                    noPerms: "你沒有權限！",
                },
                invite: {
                    clientId: `${config.clientID}`,
                    scopes: ["bot"],
                    permissions: '8',
                    redirectUri: '',
                    otherParams: ''
                },
                supportServer: {
                    slash: '/support-server',
                    inviteUrl: `https://discord.gg/${config.invite_code}`,
                },
                guildAfterAuthorization: {
                    use: true,
                    guildId: `${config.ServerID}`
                },
                sidebar: {
                    keepDefault: false,
                    list: [{
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"/></svg>`,
                        title: "<p style=\"margin-left: 40px;\">首頁</p>",
                        link: "/",
                        id: "index",
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M16 96C16 69.49 37.49 48 64 48C90.51 48 112 69.49 112 96C112 122.5 90.51 144 64 144C37.49 144 16 122.5 16 96zM480 64C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H192C174.3 128 160 113.7 160 96C160 78.33 174.3 64 192 64H480zM480 224C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H192C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224H480zM480 384C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416C160 398.3 174.3 384 192 384H480zM16 416C16 389.5 37.49 368 64 368C90.51 368 112 389.5 112 416C112 442.5 90.51 464 64 464C37.49 464 16 442.5 16 416zM112 256C112 282.5 90.51 304 64 304C37.49 304 16 282.5 16 256C16 229.5 37.49 208 64 208C90.51 208 112 229.5 112 256z"/></svg>`,
                        title: "命令列表",
                        link: "/commands",
                        id: "commands",
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M464 64C490.5 64 512 85.49 512 112V176C512 202.5 490.5 224 464 224H48C21.49 224 0 202.5 0 176V112C0 85.49 21.49 64 48 64H464zM448 128H320V160H448V128zM464 288C490.5 288 512 309.5 512 336V400C512 426.5 490.5 448 464 448H48C21.49 448 0 426.5 0 400V336C0 309.5 21.49 288 48 288H464zM192 352V384H448V352H192z"/></svg>`,
                        title: "設定",
                        link: "/manage",
                        id: "manage",
                    },
                    {
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>`,
                        title: "隱私政策",
                        link: "/privacy-policy",
                        id: "pp",
                    },
                    ]
                },
                guilds: {
                    cardTitle: "伺服器",
                    cardDescription: "以下是您目前擁有權限的所有伺服器：",
                    type: "blurlist"
                },
                guildSettings: {
                    cardTitle: "伺服器",
                    cardDescription: "在這裡您可以管理公會的所有設置：",
                    customFooterCard: {
                        subtitle: "一般設定",
                        title: "也可多加利用 [ / ]斜線命令 來快速設定！",
                        customHTML: "html",
                        footer: "設定",
                    }
                },
                index: {
                    card: {
                        category: `${config.botName} 的面板 ｜ 一切的中心`,
                        title: `歡迎來到 ${config.botName} 機器人的官網，您可以在其中控制機器人的核心功能。`,
                        image: `${client.user.displayAvatarURL()}`,
                        footer: `<a href="https://discord.gg/${config.invite_code}"> ↠ 點我加入伺服器！</a>`,
                    },
                    information: {
                        category: "公告",
                        title: "信息",
                        description: `這個機器人和面板目前正在進行中，如果您發現任何不和諧的問題，請與我聯繫。`,
                        footer: "2022/01/27",
                    },
                    feeds: {
                        category: "摘要",
                        title: "機器人異常離線",
                        description: `我們已經針對此事件做修復！`,
                        footer: "2022/03/25",
                    },
                    newupdate: {
                        category: "更新",
                        title: "v0.0.2",
                        description: `上架了機器人的官網！`,
                        footer: "2022/03/27",
                    },
                },
                commands: [
                    {
                        category: "命令列表",
                        subTitle: "方便您查詢想要的命令",
                        aliasesDisabled: true,
                        list: [{
                            commandName: "help",
                            commandUsage: "/help",
                            commandDescription: "叫出命令列表",
                            //commandAlias: "沒有別稱"
                        },
                        {
                            commandName: "bot",
                            commandUsage: "/bot <子命令>",
                            commandDescription: "控制機器人",
                            //commandAlias: "Alias",
                        },
                        {
                            commandName: "敬請期待！",
                            commandUsage: "--",
                            commandDescription: "我們將會有更多的命令新增！",
                            //commandAlias: "Alias",
                        },
                        ],
                    },
                ],
            }),
            settings: [
                {
                    categoryId: 'setup',
                    categoryName: "基本設定",
                    categoryDescription: "設定機器人的基本設置",
                    categoryOptionsList: [
                        {
                            optionId: 'lang',
                            optionName: "語言",
                            optionDescription: "更改機器人的語言",
                            optionType: DBD.formTypes.select({ "zh_TW": 'zh_TW', "English": 'en' }),
                            getActualSet: async ({ guild }) => {
                                return langsSettings[guild.id] || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                langsSettings[guild.id] = newData;
                                return;
                            }
                        },
                    ]
                },
                {
                    categoryId: 'msg',
                    categoryName: "訊息設定",
                    categoryDescription: "設定機器人的各種訊息",
                    categoryOptionsList: [
                        {
                            optionId: 'join',
                            optionName: "加入訊息",
                            optionDescription: "成員加入時所顯示的訊息",
                            optionType: DBD.formTypes.embedBuilder(
                                //
                                {
                                    username: client.user.username,
                                    avatarURL: client.user.displayAvatarURL(),
                                    defaultJson: {
                                        content: "",
                                        embed: {
                                            timestamp: new Date().toISOString(),
                                            title: "歡迎 {{username}} 加入伺服器！",
                                            description: "你是第 {{member_count}} 位！"
                                        }
                                    }
                                }
                                //
                            ),
                            getActualSet: async ({ guild }) => {
                                return embedjoin[guild.id] || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                embedjoin[guild.id] = newData;
                                return;
                            }
                        },
                        {
                            optionId: 'leave',
                            optionName: "離開訊息",
                            optionDescription: "成員加入時所顯示的訊息",
                            optionType: DBD.formTypes.embedBuilder(
                                //
                                {
                                    username: client.user.username,
                                    avatarURL: client.user.displayAvatarURL(),
                                    defaultJson: {
                                        content: "",
                                        embed: {
                                            timestamp: new Date().toISOString(),
                                            title: "再見 {{username}} 離開伺服器！",
                                            description: "剩下 {{member_count}} 位！"
                                        }
                                    }
                                }
                                //
                            ),
                            getActualSet: async ({ guild }) => {
                                return embedjoin[guild.id] || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                embedjoin[guild.id] = newData;
                                return;
                            }
                        },
                    ]
                },
            ]
        });
        Dashboard.init();
        //#endregion
        //
        // #endregion 
    
})();

