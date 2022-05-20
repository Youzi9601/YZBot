const moment = require('moment');
const chalk = require('chalk');
const fs = require('fs');
const { CommandInteraction, Client } = require('discord.js');
const { log } = require('../Utils/log');
module.exports = {
    name: 'interactionCreate',
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {import('discord.js').Client} client 機器人
     */
    run: async (interaction, client) => {
        try {
            const loadCommandOptions = require('../Structures/CommandOptions/loadCommandOptions');
            if (interaction.isButton()) loadCommandOptions(client, interaction, client.commands.buttonCommands.get(interaction.customId), true, 'Button');
            else if (interaction.isSelectMenu()) loadCommandOptions(client, interaction, client.commands.selectMenus.get(interaction.customId), true, 'SelectMenus'); // (interaction.values[0] ?? interaction.customId) 已廢棄
            else if (interaction.isCommand()) loadCommandOptions(client, interaction, client.commands.slashCommands.get(interaction.commandName), true, 'SlashCommand');
            else if (interaction.isContextMenu()) loadCommandOptions(client, interaction, client.commands.contextMenus.get(interaction.commandName), true, 'ContextMenus');
        } catch (error) {
            interaction.reply(':x: 啊喔...發生了錯誤 :/\n\`\`\`' + error + '\n\`\`\`');
            log('error', '發生了錯誤！\n' + error, ture, client);
        }
    },
};