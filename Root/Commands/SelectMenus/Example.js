const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    name: 'example',
    run: async (client, interaction, container) => {
        interaction.reply('This is an example selectmenu.');
    },
};