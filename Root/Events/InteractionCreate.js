const moment = require('moment');
const chalk = require('chalk');
const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${interaction.member.user.tag}(${interaction.member.user.id}) 於 ${interaction.guild.name}(${interaction.guild.id}) #${interaction.channel.name}(${interaction.channel.id}) 中使用 ${interaction}`, function (err) {
            if (err)
                console.log(err);
        });
        const loadCommandOptions = require('../Structures/CommandOptions/loadCommandOptions');
        if (interaction.isButton()) loadCommandOptions(client, interaction, client.commands.buttonCommands.get(interaction.customId), true, 'Button');
        else if (interaction.isSelectMenu()) loadCommandOptions(client, interaction, client.commands.selectMenus.get(interaction.values[0] ?? interaction.customId), true, 'SelectMenus');
        else if (interaction.isCommand()) loadCommandOptions(client, interaction, client.commands.slashCommands.get(interaction.commandName), true, 'SlashCommand');
        else if (interaction.isContextMenu()) loadCommandOptions(client, interaction, client.commands.contextMenus.get(interaction.commandName), true, 'ContextMenus');
    },
};