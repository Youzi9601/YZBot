const { Routes, REST } = require('discord.js');
require("colors");
const { glob } = require('glob');

/**
 *
 * @param {import('./../bot').client} client
 * @param {import("./../../Config")} config
 * @returns "?"
 */
module.exports = async (client, config) => {

    client.console('Log', ">>> 應用程序命令處理程序：".blue);

    let commands = {
        global: [], // 全區
        guild: [], // 全部的伺服器
        developer: [], // 開發者
        premium: [], // 高階會員
    };

    // Slash commands handler:
    client.console('Log', '[!] 開始加載斜杠命令...'.yellow);
    // 處理類別
    const type = new Set();
    type.add('Main'); // help的主要目錄
    // 讀取檔案
    const SlashCommands = await glob(`Root/commands/slash/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });
    // 處理命令檔案
    for (let file of SlashCommands) {
        let pull = require(__dirname + `/../../${ file.replaceAll('\\', '/') }`);

        if (pull.disabled)
            continue;

        // 添加類別
        pull.type.forEach(v => {
            type.add(v);
        });

        if (pull.data, pull.data.name, pull.data.description) {
            // 如果不符合命名規則的匹配
            if (!RegExp(/^[a-z]{1,32}$/g).test(pull.data.name)) {
                client.console('Log', `[處理 - 斜線命令] 無法加載文件 ${ file }，需要與命名規則匹配！。`.red);
                continue;
            }
            // 執行註冊
            client.commands.slash.set(pull.data.name, pull);
            client.console('Log', `[處理 - 斜線命令] 加載了一個文件: ${ pull.data.name } (#${ client.commands.slash.size })`.brightGreen);

            if (!pull.setting?.guild || pull.setting.guild.use == false) {
                // 全區
                commands.global.push(pull.data);
            } else if (pull.setting.guild.premium == true) {
                // 高級
                commands.premium.push(pull.data);
            } else if (pull.setting.guild.developer == true) {
                // 開發者
                commands.developer.push(pull.data);
            } else {
                // 伺服器
                commands.guild.push(pull.data);
            }

        } else {
            client.console('Log', `[處理 - 斜線命令] 無法加載文件 ${ file }，缺少斜線命令名稱值或描述。`.red);
            continue;
        }
    }
    let category = [];
    type.forEach(v => {
        category.push(v);
    });
    client.command_category = category;
    client.console('Log', '[v] 完成加載斜杠命令...'.yellow);


    client.console('Log', '[!] 開始加載成員互動命令...'.yellow);
    // User contextmenus commands handler:
    const UserCommands = await glob(`Root/commands/contextmenus/user/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of UserCommands) {
        let pull = require(__dirname + `/../../${ file.replaceAll('\\', '/') }`);

        if (pull.disabled) continue;
        if (pull.data.name) {
            client.commands.contextmenu.user.set(pull.data.name, pull);
            client.console('Log', `[處理 - 成員互動命令] 加載了一個文件： ${ pull.data.name } (#${ client.commands.contextmenu.user.size })`.brightGreen);

            if (!pull.setting?.guild || pull.setting.guild.use == false) {
                // 全區
                commands.global.push(pull.data);
            } else if (pull.setting.guild.premium == true) {
                // 高級
                commands.premium.push(pull.data);
            } else if (pull.setting.guild.developer == true) {
                // 開發者
                commands.developer.push(pull.data);
            } else {
                // 伺服器
                commands.guild.push(pull.data);
            }

        } else {
            client.console('Log', `[處理 - 成員互動命令] 無法加載文件 ${ file }，缺少的成員命令名稱值或類型不是 2。`.red);
            continue;
        }
    }

    client.console('Log', '[v] 完成加載成員互動命令...'.yellow);


    client.console('Log', '[!] 開始加載訊息互動命令...'.yellow);
    // Message contextmenus commands handler:
    const MessageCommands = await glob(`Root/commands/contextmenus/message/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of MessageCommands) {
        let pull = require(__dirname + `/../../${ file.replaceAll('\\', '/') }`);

        if (pull.disabled) continue;
        if (pull.data.name) {
            client.commands.contextmenu.message.set(pull.data.name, pull);
            client.console('Log', `[處理 - 訊息互動命令] 加載了一個文件：${ pull.data.name } (#${ client.commands.contextmenu.message.size })`.brightGreen);

            if (!pull.setting?.guild || pull.setting.guild.use == false) {
                // 全區
                commands.global.push(pull.data);
            } else if (pull.setting.guild.premium == true) {
                // 高級
                commands.premium.push(pull.data);
            } else if (pull.setting.guild.developer == true) {
                // 開發者
                commands.developer.push(pull.data);
            } else {
                // 伺服器
                commands.guild.push(pull.data);
            }

        } else {
            client.console('Log', `[處理 - 訊息互動命令] 無法加載文件 ${ file }，缺少的訊息命令名稱值或類型不是 3。`.red);
            continue;
        }
    }

    client.console('Log', '[v] 完成加載消息互動命令...'.yellow);


    client.console('Log', '[!] 開始加載按鈕命令...'.yellow);
    // Button commands handler:
    const ButtonCommands = await glob(`Root/commands/buttons/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of ButtonCommands) {
        let pull = require(__dirname + `/../../${ file.replaceAll('\\', '/') }`);

        if (pull.disabled) continue;
        if (pull.name) {
            client.commands.button_commands.set(pull.name, pull);
            client.console('Log', `[處理 - 按鈕命令] 加載了一個文件：${ pull.name } (#${ client.commands.button_commands.size })`.brightGreen);
        } else if (pull.regex) {
            client.commands.button_commands.set('regex-' + pull.regex.toString(), pull);
            client.console('Log', `[處理 - 按鈕命令] 加載了一個文件：${ pull.regex } (#${ client.commands.button_commands.size })`.brightGreen);
        } else {
            client.console('Log', `[處理 - 按鈕命令] 無法加載文件 ${ file }，缺少了按鈕命令名稱值。`.red);
            continue;
        }
    }

    client.console('Log', '[v] 完成加載按鈕命令...'.yellow);


    client.console('Log', '[!] 開始加載選單命令...'.yellow);
    // Button commands handler:
    const SelectMenuCommands = await glob(`Root/commands/selectmenus/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of SelectMenuCommands) {
        let pull = require(__dirname + `/../../${ file.replaceAll('\\', '/') }`);

        if (pull.disabled) continue;
        if (pull.name) {
            client.commands.selectmenu_commands.set(pull.name, pull);
            client.console('Log', `[處理 - 選單命令] 加載了一個文件：${ pull.name } (#${ client.commands.selectmenu_commands.size })`.brightGreen);
        } else {
            client.console('Log', `[處理 - 選單命令] 無法加載文件 ${ file }，缺少了選單命令名稱值。`.red);
            continue;
        }
    }

    client.console('Log', '[v] 完成加載選單命令...'.yellow);


    // Registering all the application commands:
    client.commands.data = commands;
    if (!config.bot.clientID) {
        client.console('Log', "[CRASH]您需要在 config.js 中提供您的機器人 ID！".red + "\n");
        return process.exit();
    }
    /*
    // 交給shard id #0 的機器人來執行註冊命令
    if (client.shard.ids == 0) {
        const rest = new REST({ version: '10' }).setToken(config.bot.token || process.env.token);

        (async () => {
            client.console('Log', '[HANDLER] 開始註冊所有應用程序命令。'.yellow);
            // client.console('Log',JSON.stringify(commands))
            try {
                await rest.put(
                    Routes.applicationCommands(config.bot.clientID),
                    { body: commands.global },
                );

                client.console('Log', '[HANDLER] 已成功註冊所有應用程序命令。'.brightGreen);
            } catch (err) {
                client.console('Error', undefined, undefined, undefined, err);
            }
        })();
    }
    */
    function waitForReady() {
        return new Promise(resolve => {
            if (client.isReady()) {
                resolve();
            } else client.once('ready', () => {
                resolve();
            });
        });
    }
    await waitForReady();
    client.console('Log', '[HANDLER] 開始註冊所有應用程序命令。'.yellow);
    // 設定全區命令
    if (commands.global.length > 0)
        await client.application.commands.set(commands.global);
    // 設定伺服器命令 & 高級命令 & 開發者命令
    if (commands.guild.length > 0)
        (await client.guilds.fetch()).forEach(async g => {
            const guild = await g.fetch();
            // 預設
            let c = commands.guild;
            // 開發者
            if (g.id == client.config.guild.ServerID)
                c = [...c, ...commands.developer];

            // 高級
            if ((require('./../../Storage/premium.json') || []).includes(g.id))
                c = [...c, ...commands.premium];
            await guild.commands.set(c);
            client.console('Log', `[HANDLER - BUILDIING] ${ guild.id }`.brightGreen);


        });
    client.console('Log', '[HANDLER] 已成功註冊所有應用程序命令。'.brightGreen);

};
