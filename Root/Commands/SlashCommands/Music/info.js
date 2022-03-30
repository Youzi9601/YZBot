const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "info",
	description: "顯示有​​關當前播放歌曲的信息",
	options: [
	],
	default_permission: undefined,
	clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

	run: async (client, interaction, container) => {
		await interaction.deferReply()
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("隊列中沒有歌曲")

		let bar = queue.createProgressBar({
			queue: false,
			length: 19,
		})

		const song = queue.current

		await interaction.editReply({
			embeds: [new MessageEmbed()
				.setThumbnail(song.thumbnail)
				.setDescription(`目前正在播放 [${song.title}](${song.url})\n\n` + bar)
			],
		})
	},
}
