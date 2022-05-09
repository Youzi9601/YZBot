module.exports = {
    name: 'delete',
    returnNoErrors: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ButtonInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        interaction.message.delete();
    },
};