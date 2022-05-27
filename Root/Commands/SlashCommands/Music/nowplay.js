const Discord = require('discord.js');
const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\` | Filter: \`${queue.filters.join(', ') || 'Off'}\``;
module.exports = {
    command: {
        name: 'nowplay',
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
        const queue = await client.distube.getQueue(interaction);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription(':x: 啊喔...沒有東西在列隊裡播放')
                .setColor('RANDOM');
            return interaction.reply({ embeds: [queueError] });
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
        }
        const song = queue.songs[0];
        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: '現在播放', iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/master/Root/assets/music.gif' })
            .setDescription(`[${song.name}](${song.url})`)
            .addField('**觀看數:**', song.views.toString(), true)
            .addField('**喜歡數:**', song.likes.toString(), true)
            .addField('**長度:**', `${queue.formattedCurrentTime} / ${song.formattedDuration}`)
            .addField('**連結**', `[下載這首歌](${song.streamURL})`)
            .addField('**狀態**', status(queue).toString())
            .setThumbnail(song.thumbnail)
            .setColor('RANDOM')
            .setFooter({ text: `由 ${song.user.username} 請求`, iconURL: song.user.avatarURL() })
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    },
};
