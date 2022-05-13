const Discord = require('discord.js');
const { path, config } = require('../../../bot');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
// const { log } = require('./../../Utils/log')

module.exports = async function (
    client,
    message,
    command,
    isInteraction,
    interactionType,
) {
    // 指令
    if (!command) return;
    const container = {
        RootPath: path,
        Config: config,
        Discord: Discord,
    };
    // 檢查是否有以下指令設定
    if (await require('./OnlyRunOnGuilds')(message, command, Discord)) return;
    else if (await require('./Cooldown')(
        client,
        message,
        command,
        isInteraction,
        interactionType,
        Discord,
    )) return;

    // owner
    else if (await require('./OwnerOnly')(message, command, Discord)) return;
    // client
    else if (await require('./AnyClientPermissions')(message, command, Discord)) return;
    else if (await require('./ClientPermissions')(message, command, Discord)) return;

    // #region bypass
    // user
    else if (await require('./UserPermissions')(message, command, Discord)) return;
    else if (await require('./AnyUserPermissions')(message, command, Discord)) return;
    else if (await require('./RequiredAnyRole')(message, command, Discord)) return;
    else if (await require('./RequiredRoles')(message, command, Discord)) return;
    // onlyrun
    else if (await require('./OnlyChannels')(message, command, Discord)) return;
    else if (await require('./OnlyGuilds')(client, message, command, Discord)) return;
    else if (await require('./OnlyUsers')(client, message, command, Discord)) return;
    // #endregion bypass

    // 執行命令(斜線/文字)
    else {
        // Log紀錄命令使用
        const consolelogchannel = client.channels.cache.get(
            config.Channels.commandRec,
        );

        try {
            consolelogchannel.send(
                `> ${message.user.tag} 於﹝ ${message.guild.name} ﹞#${message.channel.name} (${message.guild.id} ${message.channel.id}) \n> 使用命令： ${message}  `,
            );
        } catch (error) { }

        console.info(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) +
            `${message.user.tag} 於﹝ ${message.guild.name} ﹞#${message.channel.name} (${message.guild.id} ${message.channel.id}) 使用命令： ${message}  `,
        );
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.user.tag}(${message.user.id}) 於 ${message.guild.name}(${message.guild.id}) #${message.channel.name}(${message.channel.id}) 中使用 ${message}`, function (err) {
            if (err)
                console.info(err);
        });
        // 執行斜線命令
        if (isInteraction) command.run(client, message, container);
        //
        else {
            container.Config.prefix.forEach((prefix) => {
                if (!message.content.toLowerCase().startsWith(prefix)) return;
                const cmdName = message.content
                    .trim()
                    .toLowerCase()
                    .slice(prefix.length)
                    .trim()
                    .split(' ')[0];
                const command =
                    client.commands.messageCommands.get(cmdName) ??
                    client.commands.messageCommands.get(
                        client.commands.messageCommands.aliases.get(cmdName),
                    );
                if (!command) return;
                let args = message.content.slice(prefix.length).trim();
                if (args.toLowerCase().startsWith(cmdName))
                    args = args.slice(cmdName.length).trim().split(' ');
                // 執行文字命令
                command.run(client, message, args, container);
            });
        }
    }
};
