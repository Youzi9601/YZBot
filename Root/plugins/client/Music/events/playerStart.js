const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "playerStart",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').Track} track
     */
    async execute(client, queue, track) {
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.playerStart');

        await queue.channel.sendTyping();

        const rows = [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(!queue.isPlaying ? 'music-resume' : 'music-pause')
                        .setLabel(!queue.isPlaying ? '▶ 播放' : '⏸ 暫停')
                        .setStyle(!queue.isPlaying ? 'SUCCESS' : 'DANGER'),
                    new ButtonBuilder()
                        .setCustomId(!queue.isPlaying ? 'music-pause' : 'music-resume')
                        .setLabel(!queue.isPlaying ? '⏸ 暫停' : '▶ 播放')
                        .setStyle(!queue.isPlaying ? 'DANGER' : 'SUCCESS'),
                    new ButtonBuilder()
                        .setCustomId('music-loop')
                        .setLabel(queue.repeatMode ? queue.repeatMode === 2 ? '🔁' : '🔂' : '🔃' + ' 循環')
                        .setStyle(queue.repeatMode ? queue.repeatMode === 2 ? 'SUCCESS' : 'PRIMARY' : 'SECONDARY'),
                    new ButtonBuilder()
                        .setCustomId('music-stop')
                        .setLabel('⏹ 停止')
                        .setStyle('DANGER'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music-previous')
                        .setLabel('⏪ 前一首')
                        .setStyle('SECONDARY'),
                    new ButtonBuilder()
                        .setCustomId('music-skip')
                        .setLabel('⏩ 下一首')
                        .setStyle('SECONDARY'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music-volume_up')
                        .setLabel('🔊 +10%')
                        .setStyle('SECONDARY'),
                    new ButtonBuilder()
                        .setCustomId('music-volume_default')
                        .setLabel('100%')
                        .setStyle('PRIMARY'),
                    new ButtonBuilder()
                        .setCustomId('music-volume_down')
                        .setLabel('🔉 -10%')
                        .setStyle('SECONDARY'),
                ),

        ];

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`[\`${ track.title }\`](${ track.source })  — ${ track.author }`)
            .addFields(
                {
                    name: '**觀看數:**',
                    value: track.views.toString(),
                    inline: true,
                },
                {
                    name: '**長度:**',
                    value: track.duration.toString(),
                    inline: true,
                },
                {
                    name: '**播放者**',
                    value: track.requestedBy.toString(),
                    inline: false,
                },
            )
            .setThumbnail(track.thumbnail)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0xf24e43);


        await queue.channel.send({
            embeds: [embed],
            components: rows,
        });
    },
};
