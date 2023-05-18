const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

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

        const repeat = queue.repeatMode === QueueRepeatMode.AUTOPLAY ? '自動' :
            (queue.repeatMode === QueueRepeatMode.QUEUE ? '列隊' :
                (queue.repeatMode === QueueRepeatMode.TRACK ? '這首歌' :
                    (queue.repeatMode === QueueRepeatMode.OFF ? '關閉' :
                        '未知')));
        const status = `音量: \`${ queue.node.volume }%\` | 重複模式: \`${repeat}\` | 過濾器: \`${ queue.filters.join(', ') || '關閉' }\``;
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.playerStart');

        await queue.channel.sendTyping();

        const rows = [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(!queue.isPlaying ? 'music-resume' : 'music-pause')
                        .setLabel(!queue.isPlaying ? '▶ 播放' : '⏸ 暫停')
                        .setStyle(!queue.isPlaying ? ButtonStyle.Success : ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(!queue.isPlaying ? 'music-pause' : 'music-resume')
                        .setLabel(!queue.isPlaying ? '⏸ 暫停' : '▶ 播放')
                        .setStyle(!queue.isPlaying ? ButtonStyle.Danger : ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('music-loop')
                        .setLabel(
                            queue.repeatMode === QueueRepeatMode.AUTOPLAY ? '♾自動' :
                                (queue.repeatMode === QueueRepeatMode.QUEUE ? '🔁列隊' :
                                    (queue.repeatMode === QueueRepeatMode.TRACK ? '🎵這首歌' :
                                        (queue.repeatMode === QueueRepeatMode.OFF ? '❌關閉' :
                                            '未知')))
                                + ' 循環')
                        .setStyle(
                            queue.repeatMode === QueueRepeatMode.AUTOPLAY ? ButtonStyle.Success :
                                (queue.repeatMode === QueueRepeatMode.QUEUE ? ButtonStyle.Secondary :
                                    (queue.repeatMode === QueueRepeatMode.TRACK ? ButtonStyle.Primary :
                                        (queue.repeatMode === QueueRepeatMode.OFF ? ButtonStyle.Danger :
                                            '未知'))),
                        ),
                    new ButtonBuilder()
                        .setCustomId('music-stop')
                        .setLabel('⏹ 停止')
                        .setStyle(ButtonStyle.Danger),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music-previous')
                        .setLabel('⏪ 前一首')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music-skip')
                        .setLabel('⏩ 下一首')
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music-volume_up')
                        .setLabel('🔊 +10%')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music-volume_default')
                        .setLabel('100%')
                        .setStyle('PRIMARY'),
                    new ButtonBuilder()
                        .setCustomId('music-volume_down')
                        .setLabel('🔉 -10%')
                        .setStyle(ButtonStyle.Secondary),
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
                    inline: true,
                },
                {
                    name: '**狀態**',
                    value: status,
                    inline: true,
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
