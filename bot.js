const ci = process.env.CI;
const fs = require('fs');
const fetch = require('node-fetch');

let config = require('./Config');
module.exports.config = config;

(async () => {
    // module.exports = { client, path, config };

    // #region 啟動設定
    // const { log } = require('./Root/Utils/log')
    const chalk = require('chalk');
    const moment = require('moment');
    const Discord = require('discord.js');
    const Cluster = require('discord-hybrid-sharding');

    const path = __dirname;
    const client = new Discord.Client({
        shards: Cluster.data.SHARD_LIST, // 將生成的分片列表數組
        shardCount: Cluster.data.TOTAL_SHARDS, // 總分片數
        intents: [
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS',
            'DIRECT_MESSAGE_TYPING',
            'GUILDS',
            'GUILD_BANS',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_INTEGRATIONS',
            'GUILD_INVITES',
            'GUILD_MEMBERS',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MESSAGE_TYPING',
            'GUILD_PRESENCES',
            'GUILD_SCHEDULED_EVENTS',
            'GUILD_VOICE_STATES',
            'GUILD_WEBHOOKS',
        ],
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT'],
        // ws可用於讓機器人上線狀態為使用"手機"
        // ws: { properties: { $browser: 'Discord iOS' } },
    });

    client.cluster = new Cluster.Client(client);

    const { Shard } = require('discord-cross-hosting');
    client.machine = new Shard(client.cluster); // Initialize Cluster

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
        // 儲存位置
        storage: './Storage/giveaways.json',
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
    // require('./Root/Plugins/discord/Giveaway')(client);

    // Distube
    const Distube = require('distube');
    const { SoundCloudPlugin } = require('@distube/soundcloud');
    const { SpotifyPlugin } = require('@distube/spotify');
    const { YouTubeDLPlugin } = require('@distube/yt-dlp');

    /* eslint new-cap: ["error", { "properties": false }] */
    client.distube = new Distube.default(client, {
        youtubeDL: false,
        leaveOnEmpty: true,
        emptyCooldown: 180,
        leaveOnFinish: false,
        emitNewSongOnly: true,
        updateYouTubeDL: true,
        nsfw: true,
        youtubeCookie: process.env.ytcookie,
        plugins: [new SoundCloudPlugin(), new SpotifyPlugin(), new YouTubeDLPlugin()],
    });
    // require('./Root/Plugins/discord/guild/music')(client);

    //
    require('./Root/Plugins/plugins')(client);
    //

    // #endregion


    // #region 變數輸出
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
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
    client.commands.modals = new Discord.Collection();

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
    const Handler = require(`${ path }/Root/Structures/Handlers/Handler`);

    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '讀取事件觸發...',
    );
    await Handler.loadEvents(client);

    // 執行登入
    if (ci === 'true')
        console.info(chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + chalk.red('CI測試事件> ') + 'CI測試進行中...');


    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '機器人檔案讀取中...',
    );
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
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
        fs.readFile('./eula.txt', function (err, data) {
            if (err) {
                fs.writeFile('./eula.txt', '', function () {
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
                name: `${ client.user.username } 暫停服務...`,
                // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
            },
        ],
        // browser: 'DISCORD IOS',
        status: 'dnd', // 還沒啟動完成
    });
    console.log(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + chalk.white(`成功使用 ${ client.user.tag } 登入!`),
    );

    // 防止崩潰
    require('./Root/Structures/Handlers/Anticrash')(client);

    // rpc
    if (config.beta.rpc.run == 'true' || config.beta.rpc.run == true) {
        // 這是測試功能
        const { rpc } = require('./Root/Plugins/discord/client/rpc');
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
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '讀取訊息命令...',
    );
    await Handler.loadMessageCommands(client, path);
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '載入斜線命令...',
    );
    await Handler.loadSlashCommands(client, path);
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '載入互動選單...',
    );
    await Handler.loadContextMenus(client, path);
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '讀取按鈕交互...',
    );
    await Handler.loadButtonCommands(client, path);
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '讀取選單交互...',
    );
    await Handler.loadSelectMenus(client, path);
    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + '讀取模態交互...',
    );
    await Handler.loadModals(client, path);


    console.info(
        chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + chalk.green('完成讀取！'),
    );

    // 處理Webhook
    if (`${ config.webhook.use }` == 'true') {
        console.info(
            chalk.gray(
                `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
            ) + '啟動Webhook接收...',
        );
        try {
            require('./Root/Plugins/web/webhook')(client);
        } catch (error) {
            console.error('錯誤：Port已被占用！(或是不可用)')
        }
    }


    // 處理網頁
    if (`${ config.web.noWeb }` == 'false') {
        const web = require('./Root/Plugins/web/web.js');
        console.info(
            chalk.gray(
                `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
            ) + chalk.white('連線網站...'),
        );
        await web.web(client);
        let port80 = false;
        if (config.web.port == 80) {
            port80 = true;
        }
        console.info(chalk.gray(
            `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] ${ config.console_prefix }`,
        ) + chalk.white('請將以下網址複製到') + chalk.blue(` https://discord.com/developers/applications/${ config.clientID }/oauth2/general`) + chalk.white(' 中的 Redirects ！') + chalk.blue(`\n${ config.web.domain }${ port80 ? '' : `:${ config.web.port }` }/discord/callback`));
        // console.info(`${config.web.domain}${port80 ? '' : `:${config.web.port}`}`)
    }

    //
    const { keepalive } = require('./Root/Structures/Handlers/keepalive');
    // 執行刷存在感
    keepalive();
    // #endregion

    // END


})();

