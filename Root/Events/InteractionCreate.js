const moment = require('moment');
const chalk = require('chalk');
const fs = require('fs');
const { CommandInteraction, Client } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    run: async (interaction, client) => {
        const loadCommandOptions = require('../Structures/CommandOptions/loadCommandOptions');
        if (interaction.isButton()) loadCommandOptions(client, interaction, client.commands.buttonCommands.get(interaction.customId), true, 'Button');
        else if (interaction.isSelectMenu()) loadCommandOptions(client, interaction, client.commands.selectMenus.get(interaction.values[0] ?? interaction.customId), true, 'SelectMenus');
        else if (interaction.isCommand()) loadCommandOptions(client, interaction, client.commands.slashCommands.get(interaction.commandName), true, 'SlashCommand');
        else if (interaction.isContextMenu()) loadCommandOptions(client, interaction, client.commands.contextMenus.get(interaction.commandName), true, 'ContextMenus');
    },
};