const ci = process.env.CI;
const update_mode = process.env.update_mode || require('./Root/Utils/UpdateBot').update_mode || false
const fs = require('fs');
const fetch = require('node-fetch');

(async () => {
    const version = require('./package.json').version;

    /** @param {import('./Config.js')} config */
    let config;

    try {
        config = require('./Config');
    } catch (error) {
        config = require('./Config.example');
        console.error('\x1b[31m%s\x1b[0m', '錯誤：沒有 Config.js 檔案！請將 "Config.example.js" 改成 "Config.js"！');
        if (ci != 'true') { // 避免CI執行
            // 如果沒有Config.example.js，自動創建新的
            if (!require('./Config.example')) {
                console.log('\x1b[34m%s\x1b[0m', '因為找不到 Config.example，所以正在從內部資料複製一份 Config.js ');
                await require('./Root/Utils/UpdateBot').config_update(config)
                    .then(() => {
                        console.log('\x1b[34m%s\x1b[0m', 'Config.js 複製成功！');
                    })
                    .catch((err) => {
                        console.error('\x1b[31m%s\x1b[0m', '錯誤：' + err);
                        process.exit(1);
                    });

            }
            // 如果有，則自動更改檔案名稱
            else {
                console.log('\x1b[34m%s\x1b[0m', '有找到 Config.example.js ，正在更改名稱......');
                await rename_config();
                async function rename_config() {
                    return fs.rename('Config.example.js', 'Config.js', function () {
                        //
                    });
                }
                console.log('\x1b[34m%s\x1b[0m', '更改成功！');

            }
            console.log('\x1b[34m%s\x1b[0m', '請重新啟動機器人！');
            process.exit(0);
        } else {
            console.log('跳過Config修正');
        }
    }

    // 輸出Config
    exports.config = config;

    // 檢測更新
    fetch('https://raw.githubusercontent.com/Youzi9601/YZBot/master/package.json')
        .then((res) => res.json())
        .then((data) => {
            if (data.version != version || `${config.commit}` == 'true') {

                // 執行自動更新，不跳通知
                if (`${config.autoupdate}` == 'true') {
                    // 下載npm
                    // const exec = require('child_process').exec;
                    // pm2 start bot.js --watch --name "YZB"
                    // await exec('npm i');
                    UpdateBot();
                    async function UpdateBot() {
                        require('./Root/Utils/UpdateBot').update();
                    }

                    // 不執行更新，但跳出通知
                } else {
                    console.log('\x1b[32m%s\x1b[0m', '───────────────────────────────機器人更新───────────────────────────────');
                    console.log('\x1b[32m%s\x1b[0m', '新版本: v' + data.version);
                    console.log('\x1b[32m%s\x1b[0m', `啟動機器人後於Discord輸入 \`${config.prefix[0]}exec npm run update\` 來更新機器人`);
                    console.log('\x1b[36m%s\x1b[0m', '檢查提交: https://github.com/Youzi9601/YZBot/commits/master');
                    console.log('\x1b[32m%s\x1b[0m', '───────────────────────────────機器人更新───────────────────────────────');

                }

            } else {
                console.log('\x1b[32m%s\x1b[0m', '沒有可用的更新');
            }
        })
        .catch((err) => {
            console.log('\x1b[31m%s\x1b[0m', err);
        });

    if (update_mode == true) return;
    // module.exports = { client, path, config };

    // #region 啟動設定
    // const { log } = require('./Root/Utils/log')
    const chalk = require('chalk');
    const moment = require('moment');
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

    const { DiscordTogether } = require('discord-together');
    client.discordTogether = new DiscordTogether(client);

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
        storage: './Root/Plugins/discord/storage/giveaways.json',
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
    require('./Root/Plugins/discord/Giveaway')(client);

    if (`${config.webhook.use}` == 'true') {
        console.info(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + '啟動Webhook接收...',
        );
        require('./Root/Plugins/web/webhook')(client);
    }
    // #endregion


    // #region 變數輸出
    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取運轉文件...(可能需要花上很多時間)',
    );
    //
    client.commands = {};
    client.events = new Discord.Collection(); // [${moment().format("YYYY-MM-DD HH:mm:ss")}] 為時間截
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();

    // 輸出檔案
    exports.client = client;
    exports.path = path;
    // #endregion


    // #region 自動更新
    /*
    if (`${config.autoupdate}` == 'true') {
        const aufg = require('auto-update-from-github');

        aufg({
            git: 'Youzi9601/YZBot', // 遠程git地址
            dir: '.', // 本地路徑
            type: 'version', // 檢測類型 version | commit
            freq: 3600000, // 刷新頻率0
        });
    }
    */
    // #endregion

    // #region 運轉
    /**
     *
     * 運轉
     *
     */

    // 執行讀取
    const Handler = require(`${path}/Root/Structures/Handlers/Handler`);

    console.info(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '讀取事件觸發...',
    );
    await Handler.loadEvents(client);

    // 執行登入
    if (ci === 'true')
        console.info(chalk.gray(
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
        fs.readFile('./eula.txt', function(err, data) {
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

    // 防止崩潰
    require('./Root/Structures/Handlers/Anticrash')(client);

    // rpc
    if (config.beta.rpc.run == 'true' || config.beta.rpc.run == true) {
        // 這是測試功能
        const { rpc } = require('./Root/Plugins/discord/status/rpc');
        rpc();
    }
    // #endregion

    // #region 運作
    /**
     *
     * 登入機器人後所執行的事情
     *
     */
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
    if (`${config.web.noWeb}` == 'false') {
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
    const { keepalive } = require('./Root/Structures/Handlers/keepalive');
    // 執行刷存在感
    keepalive();
    // #endregion

    // END


})();

