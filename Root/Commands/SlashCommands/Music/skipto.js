const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    name: "skipto",
    description: "跳到某個曲目",
    options: [
      {
        maxValue: undefined,
        minValue: 1,
        choices: undefined,
        autocomplete: undefined,
        type: 10,
        name: "tracknumber",
        description: "要跳到的曲目",
        required: true,
      },
    ],
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    run: async (client, interaction, container) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("隊列中沒有歌曲")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("無效的軌道號")
        queue.skipTo(trackNum - 1)

        await interaction.editReply(`向前跳到軌道號 ${trackNum}`)
    },
}
