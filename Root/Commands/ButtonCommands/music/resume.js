module.exports = {
	name: 'music_resume',
	returnNoErrors: false,
	/**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ButtonInteraction} interaction
     * @param {*} container
     */
	async run(client, interaction, container) {
		await require('./../../SlashCommands/Music/resume').run(client, interaction, container);
	},
};