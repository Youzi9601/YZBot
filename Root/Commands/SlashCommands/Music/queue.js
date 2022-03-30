const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "queue",
    description: "顯示當前歌曲列隊",
    options: [
        {
            maxValue: undefined,
            minValue: 1,
            choices: undefined,
            autocomplete: undefined,
            type: 10,
            name: "page",
            description: "列隊的頁碼",
            required: false,
        },
    ],
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    run: async (client, interaction, container) => {
        await interaction.deferReply()
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply("列隊中沒有歌曲")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages)
            return await interaction.editReply(`無效頁面。總共只有 ${totalPages} 歌曲頁面`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**目前正在播放**\n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "無") +
                        `\n\n**列隊**\n${queueString}`
                    )
                    .setFooter({
                        text: `第 ${page + 1} 頁，共 ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}