const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "leave",
    description: "停止機器人並清除隊列",
    options: [
    ],
    default_permission: undefined,
	clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

	run: async (client, interaction, container) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("隊列中沒有歌曲")

		queue.destroy()
        await interaction.editReply("再見！")
	},
}
