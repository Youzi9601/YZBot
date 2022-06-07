const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const status = (queue) => `音量: \`${queue.volume}%\` | 重複: \`${queue.repeatMode ? queue.repeatMode === 2 ? '所有列隊' : '這首歌' : '關閉'}\` | 自動播放: \`${queue.autoplay ? '開啟' : '關閉'}\` | 過濾器: \`${queue.filters.join(', ') || '關閉'}\``;
module.exports = {
    command: {
        name: 'nowplaying',
        description: '取得當前播放的歌曲',
        options: [],
    },
    cooldown: 5000,
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    /**
      *
      * @param {import('discord.js').Client} client
      * @param {import('discord.js').CommandInteraction} interaction
      * @param {*} container
      */
    run: async (client, interaction, container) => {
        /** @param {import('distube').Queue} queue */
        const queue = await client.distube.getQueue(interaction);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        if (!queue) {
            const queueError = new MessageEmbed()
                .setDescription(':x: 啊喔...沒有東西在列隊裡播放')
                .setColor('RANDOM');
            return interaction.reply({ embeds: [queueError] });
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
        }
        const song = queue.songs[0];

        // 更改按鈕
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
            .setAuthor({ name: `${client.user.username} 正在播放...`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/master/Root/assets/music.gif' })
            .setDescription(`[${song.name}](${song.url})`)
            .addField('**觀看數:**', song.views.toString(), true)
            .addField('**喜歡數:**', song.likes.toString(), true)
            .addField('**長度:**', `${queue.formattedCurrentTime} / ${song.formattedDuration}`, true)
            .addField('**連結**', `[下載這首歌](${song.streamURL})`, true)
            .addField('**狀態**', status(queue).toString(), false)
            .setThumbnail(song.thumbnail)
            .setColor('RANDOM')
            .setFooter({ text: `由 ${song.user.username} 請求`, iconURL: song.user.avatarURL() })
            .setTimestamp();
        return interaction.reply({ embeds: [embed], components: rows });
    },
};
