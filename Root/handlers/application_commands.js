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
    console.log(`[#${client.shard.ids}]  ` + ">>> 應用程序命令處理程序：".blue);

    let commands = [];

    // Slash commands handler:
    console.log(`[#${client.shard.ids}]  ` + '[!] 開始加載斜杠命令...'.yellow);
    fs.readdirSync('./Root/commands/slash/').forEach((dir) => {
        const SlashCommands = fs.readdirSync(`./Root/commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of SlashCommands) {
            let pull = require(`../commands/slash/${dir}/${file}`);

            if (pull.name, pull.description, pull.type == 1) {
                // 如果不符合命名規則的匹配
                if (!RegExp(/^[a-z]{1,32}$/g).test(pull.name))
                    return console.log(`[#${client.shard.ids}]  [處理 - 斜線命令] 無法加載文件 ${file}，需要與命名規則匹配！。`.red)

                // 執行註冊
                client.slash_commands.set(pull.name, pull);
                console.log(`[#${client.shard.ids}]  [處理 - 斜線命令] 加載了一個文件: ${pull.name} (#${client.slash_commands.size})`.brightGreen);

                commands.push({
                    name: pull.name,
                    description: pull.description,
                    type: pull.type || 1,
                    options: pull.options ? pull.options : null,
                    dm_permission: pull.permissions.dm_permission ? pull.permissions.dm_permission : false,
                    default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
                    default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null,
                });

            } else {
                console.log(`[#${client.shard.ids}]  [處理 - 斜線命令] 無法加載文件 ${file}，缺少斜線命令名稱值、描述或類型不是 1。`.red)
                continue;
            }
        }
    });

    console.log(`[#${client.shard.ids}]  ` + '[!] 開始加載用戶命令...'.yellow);
    // User contextmenus commands handler:
    fs.readdirSync('./Root/commands/contextmenus/user/').forEach((dir) => {
        const UserCommands = fs.readdirSync(`./Root/commands/contextmenus/user/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of UserCommands) {
            let pull = require(`../commands/contextmenus/user/${dir}/${file}`);

            if (pull.name, pull.type == 2) {
                client.user_commands.set(pull.name, pull);
                console.log(`[#${client.shard.ids}]  [處理 - 成員命令] 加載了一個文件： ${pull.name} (#${client.user_commands.size})`.brightGreen);

                commands.push({
                    name: pull.name,
                    type: pull.type || 2,
                });

            } else {
                console.log(`[#${client.shard.ids}]  [處理 - 成員命令] 無法加載文件 ${file}，缺少的成員命令名稱值或類型不是 2。`.red)
                continue;
            }
        }
    });

    console.log(`[#${client.shard.ids}]  ` + '[!] 開始加載消息命令...'.yellow);
    // Message contextmenus commands handler:
    fs.readdirSync('./Root/commands/contextmenus/message/').forEach((dir) => {
        const MessageCommands = fs.readdirSync(`./Root/commands/contextmenus/message/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of MessageCommands) {
            let pull = require(`../commands/contextmenus/message/${dir}/${file}`);

            if (pull.name, pull.type == 3) {
                client.message_commands.set(pull.name, pull);
                console.log(`[#${client.shard.ids}]  [處理 - 訊息命令] 加載了一個文件：${pull.name} (#${client.user_commands.size})`.brightGreen);

                commands.push({
                    name: pull.name,
                    type: pull.type || 3,
                });

            } else {
                console.log(`[#${client.shard.ids}]  [處理 - 訊息命令] 無法加載文件 ${file}，缺少的訊息命令名稱值或類型不是 3。`.red)
                continue;
            }
        }
    });

    // Registering all the application commands:
    if (!config.bot.clientID) {
        console.log(`[#${client.shard.ids}]  ` + "[CRASH]您需要在 config.js 中提供您的機器人 ID！".red + "\n");
        return process.exit();
    }

    if (client.shard.ids == 0) {
        const rest = new REST({ version: '10' }).setToken(config.bot.token || process.env.token);

        (async () => {
            console.log(`[#${client.shard.ids}]  ` + '[HANDLER] 開始註冊所有應用程序命令。'.yellow);

            try {
                await rest.put(
                    Routes.applicationCommands(config.bot.clientID),
                    { body: commands },
                );

                console.log(`[#${client.shard.ids}]  ` + '[HANDLER] 已成功註冊所有應用程序命令。'.brightGreen);
            } catch (err) {
                console.log(err);
            }
        })();
    }
};
