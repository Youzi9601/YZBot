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
    name: 'report_message',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const firstResponse = interaction.fields.getTextInputValue('msg');
        interaction.reply({ content: '你的舉報已收到！' + Formatters.codeBlock('markdown', firstResponse), ephemeral: true });
    },
};