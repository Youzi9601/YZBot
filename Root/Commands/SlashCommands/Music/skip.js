const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "skip",
    description: "跳過當前歌曲",
    options: [
    ],
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    run: async (client, interaction, container) => {
        interaction.deferReply()
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("隊列中沒有歌曲")

        const currentSong = queue.current

		queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} 已被跳過！`).setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
