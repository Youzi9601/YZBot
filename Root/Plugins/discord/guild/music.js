const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports =
    /**
     *
     * @param {import('discord.js').Client} client
     */
    (client) => {
        const status = (queue) => `音量: \`${queue.volume}%\` | 重複: \`${queue.repeatMode ? queue.repeatMode === 2 ? '所有列隊' : '這首歌' : '關閉'}\` | 自動播放: \`${queue.autoplay ? '開啟' : '關閉'}\` | 過濾器: \`${queue.filters.join(', ') || '關閉'}\``;
        // DisTube event listeners
        client.distube
            .on('playSong',
                /**
                 *
                 * @param {import('distube').Queue} queue
                 * @param {import('distube').Song} song
                 */
                (queue, song) => {
                    queue.textChannel.sendTyping();
                    const rows = [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(queue.paused ? 'music_resume' : 'music_pause')
                                    .setLabel(queue.paused ? '▶ 播放' : '⏸ 暫停')
                                    .setStyle(queue.paused ? 'SUCCESS' : 'DANGER'),
                                new MessageButton()
                                    .setCustomId(queue.paused ? 'music_pause' : 'music_resume')
                                    .setLabel(queue.paused ? '⏸ 暫停' : '▶ 播放')
                                    .setStyle(queue.paused ? 'DANGER' : 'SUCCESS'),
                                new MessageButton()
                                    .setCustomId('music_loop')
                                    .setLabel(queue.repeatMode ? queue.repeatMode === 2 ? '🔁' : '🔂' : '🔃' + ' 循環')
                                    .setStyle(queue.repeatMode ? queue.repeatMode === 2 ? 'SUCCESS' : 'PRIMARY' : 'SECONDARY'),
                                new MessageButton()
                                    .setCustomId('music_stop')
                                    .setLabel('⏹ 停止')
                                    .setStyle('DANGER'),
                            ),
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('music_previous')
                                    .setLabel('⏪ 前一首')
                                    .setStyle('SECONDARY'),
                                new MessageButton()
                                    .setCustomId('music_skip')
                                    .setLabel('⏩ 下一首')
                                    .setStyle('SECONDARY'),
                            ),
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('music_volume_up')
                                    .setLabel('🔊 +10%')
                                    .setStyle('SECONDARY'),
                                new MessageButton()
                                    .setCustomId('music_volume_default')
                                    .setLabel('100%')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('music_volume_down')
                                    .setLabel('🔉 -10%')
                                    .setStyle('SECONDARY'),
                            ),

                    ];
                    const embed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setAuthor({ name: `${client.user.username} 開始播放...`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/master/Root/assets/music.gif' })
                        .setThumbnail(song.thumbnail)
                        .setDescription(`[${song.name}](${song.url})`)
                        .addField('**觀看數:**', song.views.toString(), true)
                        .addField('**喜歡數:**', song.likes.toString(), true)
                        .addField('**長度:**', song.formattedDuration.toString(), true)
                        .addField('**狀態**', status(queue).toString(), false)
                        .setFooter({ text: `由 ${song.user.username} 請求`, iconURL: song.user.avatarURL() })
                        .setTimestamp();

                    queue.textChannel.send({ embeds: [embed], components: rows });
                    queue.voice.setSelfDeaf(true);
                    // queue.voice.setSelfMute(false)
                    if (queue.clientMember.voice.channel.type == 'GUILD_STAGE_VOICE')
                        queue.clientMember.guild.me.voice.setSuppressed(false);
                })
            .on('addSong', (queue, song) => {
                queue.textChannel.sendTyping();
                const embed = new MessageEmbed()
                    .setTitle(':ballot_box_with_check: | 將歌曲添加到列隊')
                    .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` - 由 ${song.user} 請求`)
                    .setColor('RANDOM')
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('addList', (queue, playlist) => {
                queue.textChannel.sendTyping();
                const embed = new MessageEmbed()
                    .setTitle(':ballot_box_with_check: | 添加列表')
                    .setDescription(`添加 \`${playlist.name}\` 播放列表（${playlist.songs.length} 首歌曲）到列隊\n${status(queue)}`)
                    .setColor('RANDOM')
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('error', (textChannel, e) => {
                textChannel.sendTyping();
                console.error(e);
                textChannel.send(`遇到錯誤： ${e}`);
            })
            // .on("finish", queue => queue.textChannel.send("***No more song in queue. Leaving the channel***"))
            .on('finishSong', queue => {
                queue.textChannel.sendTyping();
                const embed = new MessageEmbed()
                    .setDescription(`:white_check_mark: | \`${queue.songs[0].name}\` 已播放完畢！準備播放下一首...`);
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('disconnect', queue => {
                queue.textChannel.sendTyping();
                const embed = new MessageEmbed()
                    .setDescription(':x: | 與語音通道斷開連接');
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('empty', queue => {
                queue.textChannel.sendTyping();
                const embed = new MessageEmbed()
                    .setDescription(':x: | 頻道沒有人。離開頻道！');
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('initQueue', (queue) => {
                queue.autoplay = false;
                queue.volume = 100;
            });
    };