const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "shuffle",
	description: "洗牌列隊",
	options: [],
	default_permission: undefined,
	clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

	run: async (client, interaction, container) => {
		await interaction.deferReply()
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("列隊中沒有歌曲")

		queue.shuffle()
		await interaction.editReply(`${queue.tracks.length} 歌曲的列隊已被洗牌！`)
	},
}
