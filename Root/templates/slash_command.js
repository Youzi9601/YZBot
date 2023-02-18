const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('description'),
    run: async (client, interaction, config, db) => {
        // execute
    },
};