const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Formatters,
} = require('discord.js');
module.exports = {
    name: 'feedback',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const firstResponse = interaction.fields.getTextInputValue('msg');
        interaction.reply('你的回饋已收到！' + Formatters.codeBlock('markdown', firstResponse));
    },
};