(async () => {
    // #region 啟動設定
    // const { log } = require('./Root/Utils/log')
    const chalk = require('chalk');
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
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
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
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT'],
        // ws可用於讓機器人上線狀態為使用"手機"
        // ws: { properties: { $browser: 'Discord iOS' } },
    });

    const { Player } = require('discord-player');
    client.slashcommands = new Discord.Collection();
    client.player = new Player(client, {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        },
    });

    // Init discord giveaways
    const { GiveawaysManager } = require('discord-giveaways');
    client.giveawaysManager = new GiveawaysManager(client, {
        storage: './giveaways.json',
        default: {
            botsCanWin: false,
            embedColor: '#E970AC',
            reaction: '🎉',
            lastChance: {
                enabled: true,
                content: '⚠️ **最後機會** ⚠️',
                threshold: 5000,
                embedColor: '#FF0000',
            },
        },
    });
    const { giveaways } = require('./Root/Plugins/discord/Giveaway');
    giveaways(client);

    // #endregion

    if (`${config.autoupdate}` == 'true') {
        // #region 自動更新
        const aufg = require('auto-update-from-github');

        aufg({
            git: 'Youzi9601/YZBot', // 遠程git地址
            dir: '.', // 本地路徑
            type: 'version', // 檢測類型 version | commit
            freq: 3600000, // 刷新頻率0
        });
        // #endregion
    }
    // #region 變數輸出
    // 輸出檔案
    exports.client = client;
    exports.path = path;
    exports.config = config;
    module.exports = { client, path, config };
    // #endregion

    // #region 運轉
    /**
   *
   * 運轉
   *
   */
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取運轉文件...(可能需要花上很多時間)',
    );
    client.commands = {};
    client.events = new Discord.Collection(); // [${moment().format("YYYY-MM-DD HH:mm:ss")}] 為時間截
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();

    // 執行讀取
    const Handler = require(`${path}/Root/Structures/Handlers/Handler`);
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取事件觸發...',
    );
    await Handler.loadEvents(client);

    // 執行登入
    const ci = process.env.CI;
    if (ci === 'true') console.info(chalk.gray(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
    ) + chalk.red('CI測試事件> ') + 'CI測試進行中...');
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '機器人檔案讀取中...',
    );
    console.info(
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

    // eula 認證
    if (ci == 'false' || !ci) { // 避免CI測試進入驗證
        const eula_pass = fs.readFile('./eula.txt', function(err, data) {
            if (err) {
                fs.writeFile('./eula.txt', '', function(err) {
                });
                console.error(
                    chalk.bgRed(
                        '沒有同意合約！我們將會為您生成一個！',
                    ),
                );

                process.exit(0);
            }

            console.info(data.toString());
            if (data.toString() != 'true') {
                console.error(
                    chalk.bgRed(
                        '沒有同意合約！請將 eula.txt 的內容改成 true ！',
                    ),
                );
                process.exit(0);
            }
        });
    } else {
        console.info(
            chalk.bgGray.white(
                '跳過eula檢查......',
            ),
        );
    }


    await client.login(config.token);
    // 設定尚未完成
    client.user.setPresence({
        activities: [
            {
                name: `${client.user.username} 暫停服務...`,
                // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
            },
        ],
        // browser: 'DISCORD IOS',
        status: 'dnd', // 還沒啟動完成
    });
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + chalk.white(`成功使用 ${client.user.tag} 登入!`),
    );
    if (config.beta.rpc.run == true) {
        // 這是測試功能
        const { rpc } = require('./Root/Plugins/discord/status/rpc');
        rpc();
    }
    // #endregion

    /**
     *
     * 登入機器人後所執行的事情
     *
     */
    // #region 運作
    // 執行登入命令
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取訊息命令...',
    );
    await Handler.loadMessageCommands(client, path);
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '載入斜線命令...',
    );
    await Handler.loadSlashCommands(client, path);
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '載入互動選單...',
    );
    await Handler.loadContextMenus(client, path);
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取按鈕交互...',
    );
    await Handler.loadButtonCommands(client, path);
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取選單交互...',
    );
    await Handler.loadSelectMenus(client, path);


    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + chalk.green('完成讀取！'),
    );

    // 處理網頁
    if (config.web.noWeb != true || config.web.noWeb == 'false') {
        const web = require('./Root/Plugins/web/web.js');
        console.info(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + chalk.white('連線網站...'),
        );
        await web.web(client);
        let port80 = false;
        if (config.web.port == 80) {
            port80 = true;
        }
        console.info(chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + chalk.white('請將以下網址複製到') + chalk.blue(` https://discord.com/developers/applications/${config.clientID}/oauth2/general`) + chalk.white(' 中的 Redirects ！') + chalk.blue(`\n${config.web.domain}${port80 ? '' : `:${config.web.port}`}/discord/callback`));
        // console.info(`${config.web.domain}${port80 ? '' : `:${config.web.port}`}`)
    }

    //
    // #endregion

    /**
     * 主命令區
     */

    // #region 事件
    // 處理錯誤
    process
        .on('unhandledRejection', (reason, promise) => {
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );

                const msg = {};
                const embed = {};
                msg.content = `<@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg);
            } catch (error) {
                // none
            }

        })
        .on('uncaughtException', (reason, promise) => {
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );

                const msg = {};
                const embed = {};
                msg.content = `<@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg);
            } catch (error) {
                // none
            }
        });
    // #endregion

})();

