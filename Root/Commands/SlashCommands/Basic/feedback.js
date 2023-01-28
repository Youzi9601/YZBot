const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Modal,
    TextInputComponent,
} = require('discord.js');

const { config } = require('../../../../bot');
module.exports = {
    command: {
        name: 'feedback',
        description: '回饋',
        options: [],
    },
    clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    userPermissions: ['SEND_MESSAGES'],
    ignoreFile: true,

    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // 內容

        // Create the modal
        const modal = new Modal()
            .setCustomId('feedback')
            .setTitle('回報');
        // Add components to modal
        // Create the text input components
        const SuggestionsInput = new TextInputComponent()
            .setCustomId('msg')
            .setRequired(true)
            // The label is the prompt the user sees for this input
            .setLabel('請問有什麼建議?')
            // Short means only a single line of text
            .setStyle('SHORT')
            .setPlaceholder('請輸入內容');
        const OthersInput = new TextInputComponent()
            .setCustomId('whatelse')
            .setLabel('還有其他的嗎?')
            // Paragraph means multiple lines of text.
            .setStyle('PARAGRAPH')
            .setPlaceholder('請輸入些什麼。');
        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new MessageActionRow().addComponents(SuggestionsInput);
        const secondActionRow = new MessageActionRow().addComponents(OthersInput);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);
        // Show the modal to the user
        await interaction.showModal(modal);
    },
};