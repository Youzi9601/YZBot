const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueryType } = require("discord-player")

module.exports = {
    name: "play",
    description: "從 youtube 加載歌曲",
    options: [
        {
            type: 1,
            name: "song",
            description: "從 url 加載一首歌曲",
            options: [
                {
                    choices: undefined,
                    autocomplete: undefined,
                    type: 3,
                    name: "url",
                    description: "這首歌的網址",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "playlist",
            description: "從 url 加載歌曲的播放列表",
            options: [
                {
                    choices: undefined,
                    autocomplete: undefined,
                    type: 3,
                    name: "url",
                    description: "播放列表的網址",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "search",
            description: "根據提供的關鍵字搜索 sogn",
            options: [
                {
                    choices: undefined,
                    autocomplete: undefined,
                    type: 3,
                    name: "searchterms",
                    description: "搜索關鍵字",
                    required: true,
                },
            ],
        },
    ],
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    run: async (client, interaction, container) => {
        // 內容
        if (!interaction.member.voice.channel) return interaction.editReply("您需要在 VC 中才能使用此命令")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("沒有結果")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** 已加入隊列`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `時長: ${song.duration}` })

        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("沒有結果")

            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} 歌曲來自 [${playlist.title}](${playlist.url})** 已添加到隊列中`)
                .setThumbnail(playlist.thumbnail)
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("沒有結果")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** 已加入隊列`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: ` 時長: ${song.duration}` })
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })

        // #endregion

    },
};