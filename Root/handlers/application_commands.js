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
  console.log("0------------------| 應用程序命令處理程序：".blue);

  let commands = [];

  // Slash commands handler:
  fs.readdirSync('./Root/commands/slash/').forEach((dir) => {
    console.log('[!] 開始加載斜杠命令...'.yellow);
    const SlashCommands = fs.readdirSync(`./Root/commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      if (pull.name, pull.description, pull.type == 1) {
        client.slash_commands.set(pull.name, pull);
        console.log(`[HANDLER - SLASH] 加載了一個文件: ${pull.name} (#${client.slash_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          dm_permission: pull.permissions.dm_permission ? pull.permissions.dm_permission : false,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
        });

      } else {
        console.log(`[HANDLER - SLASH] 無法加載文件 ${file}，缺少模塊名稱值、描述或類型不是 1。`.red)
        continue;
      };
    };
  });

  // User commands handler:
  fs.readdirSync('./Root/commands/user/').forEach((dir) => {
    console.log('[!] 開始加載用戶命令...'.yellow);
    const UserCommands = fs.readdirSync(`./Root/commands/user/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/user/${dir}/${file}`);

      if (pull.name, pull.type == 2) {
        client.user_commands.set(pull.name, pull);
        console.log(`[HANDLER - USER] 加載了一個文件： ${pull.name} (#${client.user_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          type: pull.type || 2,
        });

      } else {
        console.log(`[HANDLER - USER] 無法加載文件 ${file}，缺少的模塊名稱值或類型不是 2。`.red)
        continue;
      };
    };
  });

  // Message commands handler:
  fs.readdirSync('./Root/commands/message/').forEach((dir) => {
    console.log('[!] 開始加載消息命令...'.yellow);
    const UserCommands = fs.readdirSync(`./Root/commands/message/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/message/${dir}/${file}`);

      if (pull.name, pull.type == 3) {
        client.message_commands.set(pull.name, pull);
        console.log(`[HANDLER - MESSAGE] 加載了一個文件：${pull.name} (#${client.user_commands.size})`.brightGreen);

        commands.push({
          name: pull.name,
          type: pull.type || 3,
        });

      } else {
        console.log(`[HANDLER - MESSAGE] 無法加載文件 ${file}，缺少的模塊名稱值或類型不是 3。`.red)
        continue;
      };
    };
  });

  // Registering all the application commands:
  if (!config.bot.clientID) {
    console.log("[CRASH]您需要在 config.js 中提供您的機器人 ID！".red + "\n");
    return process.exit();
  };

  const rest = new REST({ version: '10' }).setToken(config.bot.token || process.env.token);

  (async () => {
    console.log('[HANDLER] 開始註冊所有應用程序命令。'.yellow);

    try {
      await rest.put(
        Routes.applicationCommands(config.bot.clientID),
        { body: commands }
      );

      console.log('[HANDLER] 已成功註冊所有應用程序命令。'.brightGreen);
    } catch (err) {
      console.log(err);
    }
  })();
};
