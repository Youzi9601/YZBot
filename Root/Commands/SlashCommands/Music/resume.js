const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "resume",
    description: "恢復音樂",
    options: [
    ],
    default_permission: undefined,
	clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

	run: async (client, interaction, container) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("隊列中沒有歌曲")

		queue.setPaused(false)
        await interaction.editReply("音樂已暫停！使用`/pause`恢復音樂")
	},
}
