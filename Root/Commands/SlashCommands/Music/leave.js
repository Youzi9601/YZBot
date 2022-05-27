const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    command: {
        name: 'leave',
        description: '離開語音頻道',
        options: [],
    },
    cooldown: 5000,
    run: async (client, interaction, container) => {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: '我還沒有在任何語音頻道上！', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        connection.destroy();
        await interaction.reply('***成功離開語音頻道***');
    },
};
