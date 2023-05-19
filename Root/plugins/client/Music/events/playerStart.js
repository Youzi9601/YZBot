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
        if (queue.repeatMode === QueueRepeatMode.TRACK) return; // 重複相同歌曲不須重新發送此事件
        console.debug(queue);
        console.debug(track);

        const repeat = queue.repeatMode === QueueRepeatMode.AUTOPLAY ? '自動' :
            (queue.repeatMode === QueueRepeatMode.QUEUE ? '列隊' :
                (queue.repeatMode === QueueRepeatMode.TRACK ? '這首歌' :
                    (queue.repeatMode === QueueRepeatMode.OFF ? '關閉' :
                        '未知')));
        const status = `音量: \`${ queue.node.volume }%\` | 重複模式: \`${repeat}\``; // queue.filters.join(', ')
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.playerStart');

        await queue.metadata.channel.sendTyping();

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
                                            ButtonStyle.Secondary))),
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
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('music-volume_down')
                        .setLabel('🔉 -10%')
                        .setStyle(ButtonStyle.Secondary),
                ),

        ];


        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`${translations["description"]} [\`${ track.title }\`](${ track.url })  — ${ track.author }`)
            .addFields(
                /*
                {
                    name: '**觀看數:**',
                    value: `${track.views}`,
                    inline: true,
                },
                {
                    name: '**長度:**',
                    value: `${track.duration}`,
                    inline: true,
                },
                {
                    name: '**播放者**',
                    value: `${track.requestedBy || "未知"}`,
                    inline: true,
                },
                */
                {
                    name: '**狀態**',
                    value: `${status}`,
                    inline: false,
                },
            )
            .setThumbnail(track.thumbnail)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0x41f097);

        await queue.metadata.channel.send({
            embeds: [embed],
            components: rows,
        });
    },
};

