const { messageCreate, Message } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Message} message
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (message, client, container) => {

        // 執行命令
        const loadCommandOptions = require('../../Structures/CommandOptions/loadCommandOptions');
        container.Config.prefix.forEach(prefix => {
            if (!message.content.toLowerCase().startsWith(prefix)) return;
            const cmdName = message.content.toString().toLowerCase().slice(prefix.length).trim().split(' ')[0];
            const command = client.commands.messageCommands.get(cmdName) ?? client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(cmdName));
            if (!command) return;
            if (command.allowBots) loadCommandOptions(client, message, command, false);
            else if (message.author.bot) return;
            else if (command.guildOnly == false) loadCommandOptions(client, message, command, false);
            else if (!message.guild) return;
            else loadCommandOptions(client, message, command, false);
        });

        // 其他工作

        // logging
        if (message.inGuild) {
            const isBotLog = ((message.embeds[0] ? (message.embeds[0].description ? message.embeds[0].description : 'no description') : 'no embed')).includes('```') || false;
            if (message.author.id == client.user.id && isBotLog) {
                //
            } else {
                if (message.attachments.first() !== undefined) {
                    log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送了一個附件：${message.attachments.first().url}`, false);
                }
                if (message.content !== '') {
                    log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送消息：${message.content}`, false);
                }
                if (message.embeds.length !== 0) {
                    const a = message.embeds[0];
                    const embed = {};
                    for (const b in a) {
                        if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
                            embed[b] = a[b];
                        }
                    }
                    log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送了一個嵌入： ${JSON.stringify(embed, null, 2)}`, false);
                }
            }
            // chatbot
            require('../../Plugins/discord/message/chatbot')(message, client, container);
            // suggestions_channel
            require('../../Plugins/discord/message/suggestions_channel')(message, client, container);
            // counting
            require('../../Plugins/discord/message/counting/counting_send')(message, client, container);
        }
    },
};