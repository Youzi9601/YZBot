module.exports = {
    name: 'music_loop',
    returnNoErrors: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ButtonInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        await require('../../SlashCommands/Music/loop').run(client, interaction, container);
    },
};