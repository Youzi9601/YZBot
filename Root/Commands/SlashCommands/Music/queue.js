const Discord = require('discord.js');

module.exports = {
    command: {
        name: 'queue',
        description: '顯示列隊',
    },
    cooldown: 10000,
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
        const q = queue.songs.map((song, i) => {
            return `${i === 0 ? '播放：' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
        }).join('\n');

        const embed = new Discord.MessageEmbed()
            .setDescription(`**當前列隊：** \n\n  ${q}`)
            .setColor('RANDOM');
        interaction.reply({ embeds: [embed] });
    },
};
