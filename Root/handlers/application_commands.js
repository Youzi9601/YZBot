const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");
const colors = require("colors");

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("./../../Config")} config
 * @returns "?"
 */
module.exports = (client, config) => {
    client.console('Log', ">>> 應用程序命令處理程序：".blue);

    let commands = [];

    // Slash commands handler:
    client.console('Log', '[!] 開始加載斜杠命令...'.yellow);
    // 處理類別
    const type = new Set();
    type.add('Main'); // help的主要目錄
    // 讀取檔案
    fs.readdirSync('./Root/commands/slash/').forEach((dir) => {
        const SlashCommands = fs.readdirSync(`./Root/commands/slash/${ dir }`).filter((file) => file.endsWith('.js'));
        // 處理命令檔案
        for (let file of SlashCommands) {
            let pull = require(`../commands/slash/${ dir }/${ file }`);

            if (pull.disabled)
                continue;

            // 添加類別
            pull.type.forEach(v => {
                type.add(v);
            });

            if (pull.data, pull.data.name, pull.data.description) {
                // 如果不符合命名規則的匹配
                if (!RegExp(/^[a-z]{1,32}$/g).test(pull.data.name))
                    return client.console('Log', `[處理 - 斜線命令] 無法加載文件 ${ file }，需要與命名規則匹配！。`.red);

                // 執行註冊
                client.slash_commands.set(pull.data.name, pull);
                client.console('Log', `[處理 - 斜線命令] 加載了一個文件: ${ pull.data.name } (#${ client.slash_commands.size })`.brightGreen);

                commands.push(pull.data);

            } else {
                client.console('Log', `[處理 - 斜線命令] 無法加載文件 ${ file }，缺少斜線命令名稱值或描述。`.red);
                continue;
            }
        }
    });
    let category = [];
    type.forEach(v => {
        category.push(v);
    });
    client.command_category = category;
    client.console('Log', '[v] 完成加載斜杠命令...'.yellow);


    client.console('Log', '[!] 開始加載成員互動命令...'.yellow);
    // User contextmenus commands handler:
    fs.readdirSync('./Root/commands/contextmenus/user/').forEach((dir) => {
        const UserCommands = fs.readdirSync(`./Root/commands/contextmenus/user/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of UserCommands) {
            let pull = require(`../commands/contextmenus/user/${dir}/${file}`);

            if (pull.disabled) continue;
            if (pull.name, pull.type == 2) {
                client.contextmenu_user_commands.set(pull.name, pull);
                client.console('Log', `[處理 - 成員互動命令] 加載了一個文件： ${pull.name} (#${client.contextmenu_user_commands.size})`.brightGreen);

                commands.push({
                    name: pull.name,
                    type: pull.type || 2,
                });

            } else {
                client.console('Log', `[處理 - 成員互動命令] 無法加載文件 ${file}，缺少的成員命令名稱值或類型不是 2。`.red);
                continue;
            }
        }
    });
    client.console('Log', '[v] 完成加載成員互動命令...'.yellow);


    client.console('Log', '[!] 開始加載消息互動命令...'.yellow);
    // Message contextmenus commands handler:
    fs.readdirSync('./Root/commands/contextmenus/message/').forEach((dir) => {
        const MessageCommands = fs.readdirSync(`./Root/commands/contextmenus/message/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of MessageCommands) {
            let pull = require(`../commands/contextmenus/message/${dir}/${file}`);

            if (pull.disabled) continue;
            if (pull.name, pull.type == 3) {
                client.contextmenu_message_commands.set(pull.name, pull);
                client.console('Log', `[處理 - 訊息互動命令] 加載了一個文件：${pull.name} (#${client.contextmenu_message_commands.size})`.brightGreen);

                commands.push({
                    name: pull.name,
                    type: pull.type || 3,
                });

            } else {
                client.console('Log', `[處理 - 訊息互動命令] 無法加載文件 ${file}，缺少的訊息命令名稱值或類型不是 3。`.red);
                continue;
            }
        }
    });
    client.console('Log', '[v] 完成加載消息互動命令...'.yellow);


    client.console('Log', '[!] 開始加載按鈕命令...'.yellow);
    // Button commands handler:
    fs.readdirSync('./Root/commands/buttons').forEach((dir) => {
        const ButtonCommands = fs.readdirSync(`./Root/commands/buttons/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of ButtonCommands) {
            let pull = require(`../commands/buttons/${dir}/${file}`);

            if (pull.disabled) continue;
            if (pull.name) {
                client.button_commands.set(pull.name, pull);
                client.console('Log', `[處理 - 按鈕命令] 加載了一個文件：${pull.name} (#${client.button_commands.size})`.brightGreen);
            } else {
                client.console('Log', `[處理 - 按鈕命令] 無法加載文件 ${file}，缺少了按鈕命令名稱值。`.red);
                continue;
            }
        }
    });
    client.console('Log', '[v] 完成加載按鈕命令...'.yellow);


    client.console('Log', '[!] 開始加載選單命令...'.yellow);
    // Button commands handler:
    fs.readdirSync('./Root/commands/selectmenus').forEach((dir) => {
        const SelectMenuCommands = fs.readdirSync(`./Root/commands/selectmenus/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of SelectMenuCommands) {
            let pull = require(`../commands/selectmenus/${dir}/${file}`);

            if (pull.disabled) continue;
            if (pull.name) {
                client.selectmenu_commands.set(pull.name, pull);
                client.console('Log', `[處理 - 選單命令] 加載了一個文件：${pull.name} (#${client.selectmenu_commands.size})`.brightGreen);
            } else {
                client.console('Log', `[處理 - 選單命令] 無法加載文件 ${file}，缺少了選單命令名稱值。`.red);
                continue;
            }
        }
    });
    client.console('Log', '[v] 完成加載選單命令...'.yellow);


    // Registering all the application commands:
    if (!config.bot.clientID) {
        client.console('Log', "[CRASH]您需要在 config.js 中提供您的機器人 ID！".red + "\n");
        return process.exit();
    }

    // 交給shard id #0 的機器人來執行註冊命令
    if (client.shard.ids == 0) {
        const rest = new REST({ version: '10' }).setToken(config.bot.token || process.env.token);

        (async () => {
            client.console('Log', '[HANDLER] 開始註冊所有應用程序命令。'.yellow);
            // client.console('Log',JSON.stringify(commands))
            try {
                await rest.put(
                    Routes.applicationCommands(config.bot.clientID),
                    { body: commands },
                );

                client.console('Log', '[HANDLER] 已成功註冊所有應用程序命令。'.brightGreen);
            } catch (err) {
                client.console('Error', undefined, undefined, undefined, err);
            }
        })();
    }
};
