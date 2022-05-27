const { MessageEmbed } = require('discord.js');

module.exports =
    /**
     *
     * @param {import('discord.js').Client} client
     */
    (client) => {
        const status = (queue) => `音量: \`${queue.volume}%\` | 重複: \`${queue.repeatMode ? queue.repeatMode === 2 ? '所有列隊' : '這首歌' : '關閉'}\` | 自動播放: \`${queue.autoplay ? '開啟' : '關閉'}\` | 篩選: \`${queue.filters.join(', ') || '關閉'}\``;
        // DisTube event listeners
        client.distube
            .on('playSong',
                /**
                 *
                 * @param {import('distube').Queue} queue
                 * @param {import('distube').Song} song
                 */
                (queue, song) => {
                    const embed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setAuthor({ name: `${client.user.username} 開始播放...`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/master/Root/assets/music.gif' })
                        .setThumbnail(song.thumbnail)
                        .setDescription(`[${song.name}](${song.url})`)
                        .addField('**觀看數:**', song.views.toString(), true)
                        .addField('**喜歡數:**', song.likes.toString(), true)
                        .addField('**長度:**', song.formattedDuration.toString(), true)
                        .addField('**狀態**', status(queue).toString())
                        .setFooter({ text: `由 ${song.user.username} 請求`, iconURL: song.user.avatarURL() })
                        .setTimestamp();
                    queue.textChannel.send({ embeds: [embed] });
                    queue.voice.setSelfDeaf(true);
                    // queue.voice.setSelfMute(false)
                    if (queue.clientMember.voice.channel.type == 'GUILD_STAGE_VOICE')
                        queue.clientMember.guild.me.voice.setSuppressed(false);
                })
            .on('addSong', (queue, song) => {
                const embed = new MessageEmbed()
                    .setTitle(':ballot_box_with_check: | 將歌曲添加到列隊')
                    .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` - 由 ${song.user} 播放`)
                    .setColor('RANDOM')
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('addList', (queue, playlist) => {
                const embed = new MessageEmbed()
                    .setTitle(':ballot_box_with_check: | 添加列表')
                    .setDescription(`添加 \`${playlist.name}\` 播放列表（${playlist.songs.length} 首歌曲）到列隊\n${status(queue)}`)
                    .setColor('RANDOM')
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('error', (textChannel, e) => {
                console.error(e);
                textChannel.send(`遇到錯誤： ${e}`);
            })
            // .on("finish", queue => queue.textChannel.send("***No more song in queue. Leaving the channel***"))
            .on('finishSong', queue => {
                const embed = new MessageEmbed()
                    .setDescription(`:white_check_mark: | 播放完畢\`${queue.songs[0].name}\``);
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('disconnect', queue => {
                const embed = new MessageEmbed()
                    .setDescription(':x: | 與語音通道斷開連接');
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('empty', queue => {
                const embed = new MessageEmbed()
                    .setDescription(':x: | 頻道沒有人。離開頻道！');
                queue.textChannel.send({ embeds: [embed] });
            })
            .on('initQueue', (queue) => {
                queue.autoplay = false;
                queue.volume = 100;
            });
    };