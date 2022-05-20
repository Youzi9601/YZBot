const Discord = require('discord.js');
const { path, config } = require('../../../bot');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
const { log } = require('../../Utils/log');
// const { log } = require('./../../Utils/log')
/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} message
 * @param {<命令名稱>} command
 * @param {Boolean} isInteraction
 * @param {*} interactionType 'Button'||'SelectMenus'||'SlashCommand'||'ContextMenus'
 * @returns
 */
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

    // Log紀錄命令使用
    if (interactionType == 'SlashCommand')
        log(
            'info',
            `${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用命令： ${message}  `,
            true,
            client,
            {
                embeds: [
                    {
                        color: 0x808080,
                        description: `\`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} \n${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用命令： ${message}  \`\`\``,
                    },
                ],
            },
            config.Channels.commandRec,
        );
    else if (interactionType == 'SelectMenus')
        log(
            'info',
            `${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用選單： ${message.customId} ，選擇了 ${message.values.join(',')}`,
            true,
            client,
            {
                embeds: [
                    {
                        color: 0x808080,
                        description: `\`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} \n${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用選單： ${message.customId} ，選擇了 ${message.values.join(',')}\`\`\``,
                    },
                ],
            },
            config.Channels.commandRec,
        );
    else if (interactionType == 'Button')
        log(
            'info',
            `${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用按鈕 ${message.customId}`,
            true,
            client,
            {
                embeds: [
                    {
                        color: 0x808080,
                        description: `\`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} \n${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用按鈕 ${message.customId}\`\`\``,
                    },
                ],
            },
            config.Channels.commandRec,
        );
    else if (interactionType == 'ContextMenus')
        log(
            'info',
            `${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用訊息選單交互 ${message.commandName}`,
            true,
            client,
            {
                embeds: [
                    {
                        color: 0x808080,
                        description: `\`\`\`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix} \n${message.user.tag} (${message.user.id}) 於 ${message.guild.name} (${message.guild.id}) #${message.channel.name} (${message.channel.id}) 使用訊息選單交互 ${message.commandName}\`\`\``,
                    },
                ],
            },
            config.Channels.commandRec,
        );

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
