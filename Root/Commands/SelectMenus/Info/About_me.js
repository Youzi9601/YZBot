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
    name: 'about_me',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').SelectMenuInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {

        interaction.update({
            content: '敬請期待！我們尚未完工！',
        });
    },
};