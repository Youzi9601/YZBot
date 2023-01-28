const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    command: {
        name: 'join',
        description: '加入語音頻道',
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
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        try {
            joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            if (interaction.member.voice.channel.type == 'GUILD_STAGE_VOICE')
                interaction.guild.me.voice.setSuppressed(false);
            await interaction.reply('***成功加入語音頻道***');
        } catch (error) {
            return interaction.reply({ content: `連接到語音頻道時出錯: ${error}`, ephemeral: true });
        }
    },
};
