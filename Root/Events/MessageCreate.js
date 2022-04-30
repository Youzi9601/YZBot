const { messageCreate, Client } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {messageCreate} message
     * @param {Client} client
     * @param {*} container
     */
    run: async (message, client, container) => {
        const loadCommandOptions = require('../Structures/CommandOptions/loadCommandOptions');
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

    },
};