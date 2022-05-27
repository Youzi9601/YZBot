const Discord = require('discord.js');

module.exports = {
    command: {
        name: 'jump',
        description: 'Jump to the song number in the queue',
        options: [
            {
                name: 'id',
                type: 10,
                description: 'The music\'s ID in the queue',
                required: true,
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
        const musicid = interaction.options.getNumber('id');
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
        try {
            await client.distube.jump(interaction, parseInt(musicid));
            await interaction.reply({ content: 'Jumped to the song number ' + musicid });
        } catch {
            return interaction.reply({ content: 'Invalid song id!', ephemeral: true });
        }
    },
};
