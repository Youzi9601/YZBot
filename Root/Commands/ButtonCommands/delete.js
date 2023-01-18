module.exports = {
	name: 'delete',
	returnNoErrors: true,
	/**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ButtonInteraction} interaction
     * @param {*} container
     */
	async run(client, interaction, container) {
		await interaction.message.delete();
	},
};