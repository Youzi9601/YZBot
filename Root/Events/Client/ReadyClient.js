const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('../../../bot');
const moment = require('moment');
const fs = require('fs');
const version = require('./../../../package.json').version;

module.exports = {
    name: 'ready',
    once: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @returns null
     */
    run: async (client) => {
        /*
        console.log(
             chalk.gray(
                 '\n\n───────────────────────────────機器人控制台───────────────────────────────\n',
             ),
         );
        */

        client.user.setPresence({
            activities: [
                {
                    name: `${client.user.username} 啟動中...`,
                    // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                },
            ],
            // browser: 'DISCORD IOS',
            status: 'idle', // 還在啟動中
            afk: false,
        });

        const ClientBox = new Box(
            {
                w: Math.floor(75),
                h: 7,
                stringify: false,
                marks: {
                    nw: '╭',
                    n: '─',
                    ne: '',
                    e: '',
                    se: '',
                    s: '',
                    sw: '',
                    w: '│',
                },
                hAlign: 'left',
            },
            `程序資訊

登入的帳號       ::    ${client.user.tag}
伺服器數量       ::    ${client.guilds.cache.size}
成員數量         ::    ${client.users.cache.size}
Node.JS版本      ::    ${process.version}
`, //啟動的分片系統 共${client.shard.ids.length()}個
        ).stringify();

        const CommandsBox = new Box(
            {
                w: Math.floor(75),
                h: 10,
                stringify: false,
                marks: {
                    nw: '╭',
                    n: '─',
                    ne: '',
                    e: '',
                    se: '',
                    s: '',
                    sw: '',
                    w: '│',
                },
                hAlign: 'left',
            },
            `命令資訊(可能會因為無法取得而導致數字錯誤，但不影響其功能！)

訊息命令         ::     ${client.commands.messageCommands.size} 個
訊息命令別名     ::     ${client.commands.messageCommands.aliases.size} 個
斜線命令         ::     ${client.commands.slashCommands.size} 個
選擇清單         ::     ${client.commands.selectMenus.size} 個
互動選單         ::     ${client.commands.contextMenus.size} 個
按鈕命令         ::     ${client.commands.buttonCommands.size} 個
Client 事件      ::     ${client.events.size} 個
`,
        ).stringify();


        console.log(
            chalk.gray(
                '\n───────────────────────────────機器人控制台───────────────────────────────\n\n',
            ),
        );
        console.log(
            [' __   ___________    ____  _                       _   ____        _    ',
                ' \\ \\ / /__  / __ )  |  _ \\(_)___  ___ ___  _ __ __| | | __ )  ___ | |_  ',
                '  \\ V /  / /|  _ \\  | | | | / __|/ __/ _ \\| \'__/ _` | |  _ \\ / _ \\| __| ',
                '   | |  / /_| |_) | | |_| | \\__ \\ (_| (_) | | | (_| | | |_) | (_) | |_  ',
                '   |_| /____|____/  |____/|_|___/\\___\\___/|_|  \\__,_| |____/ \\___/ \\__| ' + `  v${version}`,
                '                    [=| -= Made By Youzi9601 =-  |=]                    ',
                '                                                                        ',
            ].join('\n'),
        );

        // 紀錄資訊
        console.log(chalk.bold.greenBright(ClientBox));
        console.log(chalk.bold.blueBright(CommandsBox));

        console.log(
            chalk.gray(
                '\n───────────────────────────────機器人控制台───────────────────────────────\n\n',
            ),
        );
        //
        // 調整時差
        const Today = new Date();
        let day = Today.getDate();
        let hours = Today.getUTCHours() + config.GMT;

        if (hours >= 24) {
            hours = hours - 24;
            day = day + 1;
        }

        // 終端紀錄
        console.info(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) +
            chalk.greenBright('啟動') +
            chalk.white('於 ') +
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
            ' 秒',
        );
        try {

            const conchannel = client.channels.cache.get(config.Channels.ClientOn);
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
                ' 機器人啟動成功```';
            const embed = {
                color: 0x808080,
                description: msg,
            };

            const readymsg = await conchannel.send({ embeds: [embed] });
            require('../../Plugins/discord/client/ReadyUpdater')(readymsg, msg, client);
        } catch (error) {
            //
        }
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] 機器人成功上線！`, function (err) {
            if (err)
                console.info(err);
        });
        // 設定狀態
        client.user.setPresence({
            activities: [
                {
                    name: `${client.user.username} 啟動成功！`,
                    // ${client.guilds.cache.size}個伺服器&${client.users.cache.size}個使用者
                },
            ],
            // browser: 'DISCORD IOS',
            status: 'online', // 還沒啟動成功
        });

        // CI
        const ci = process.env.CI;
        function cie() {
            console.info(
                chalk.gray(
                    `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                ) + 'CI機器人測試成功! 關閉機器人...',
            );
            process.exit();
        }
        if (ci === 'true') return cie();
        //
        // end
    },
};
