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
module.exports = async function(
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

    const msg = {
        event: '交互創建',
        content: '',
    };

    if (interactionType == 'SlashCommand')
        msg.content = [
            `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
            '位置：',
            `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
            `- 頻道 #${message.channel.name} (${message.channel.id})`,
            `[ (/)斜線 SlashCommand ] 命令(${message.id})： ${message}`,
        ].join('\n');
    else if (interactionType == 'SelectMenus')
        msg.content = [
            `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
            '位置：',
            `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
            `- 頻道 #${message.channel.name} (${message.channel.id})`,
            `[ 選單 SelectMenus ] 命令(${message.id})：${message.customId} ，選擇了 ${message.values.join(',')}`,
        ].join('\n');
    else if (interactionType == 'Button')
        msg.content = [
            `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
            '位置：',
            `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
            `- 頻道 #${message.channel.name} (${message.channel.id})`,
            `[ 按鈕 Button ] 命令(${message.id})：${message.customId}`,
        ].join('\n');
    else if (interactionType == 'ContextMenus')
        msg.content = [
            `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
            '位置：',
            `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
            `- 頻道 #${message.channel.name} (${message.channel.id})`,
            `[ 上下文選單 ContextMenus ] 命令(${message.id})：${message.commandName}`,
        ].join('\n');
    else if (interactionType == 'Modal')
        msg.content = [
            `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
            '位置：',
            `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
            `- 頻道 #${message.channel.name} (${message.channel.id})`,
            `[ 模態 Modal ] 命令(${message.id})：${message.customId}`,
        ].join('\n');
    else msg.content = [
        `成員：${message.user ? message.user.tag + `(${message.user.id})` : '無法取得使成員 (??????)'}`,
        '位置：',
        `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
        `- 頻道 #${message.channel.name} (${message.channel.id})`,
        `[ ??? ] 命令(${message.id})：??? 無法讀取`,
    ].join('\n');

    log('botguild-log',
        msg,
        true,
        client,
        undefined,
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
    else if (isInteraction) {
        try {
            command.run(client, message, container);
        } catch (error) {
            message.reply({ content: ':x: 啊喔...發生了錯誤 :/\n\`\`\`' + error + '\n\`\`\`', ephemeral: true });
            log('error', '發生了錯誤！\n' + error, ture, client);
        }

    }
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
};
