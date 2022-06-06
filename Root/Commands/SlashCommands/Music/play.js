module.exports = {
    command: {
        name: 'play',
        description: '播放音樂 (沒輸入關鍵字則為 "NCS 24/7音樂電台" )',
        options: [
            {
                name: 'query',
                type: 3,
                description: '你想播放的歌曲｜支持的網址：youtube、soundcloud、Spotify',
                required: false,
            },
        ],

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
        const queue = await client.distube.getQueue(interaction);
        const query = interaction.options.get('query') ? interaction.options.get('query').value : 'https://www.youtube.com/watch?v=7tNtU5XFwrU';

        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        if (queue) {
            if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
            }
        }
        await interaction.reply('🔍 **正在搜索和嘗試...**');
        await interaction.editReply('已找到，正在處理！ :ok_hand:');
        client.distube.play(voiceChannel, query, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
    },
};
