const Discord = require('discord.js');

module.exports = {
    command: {
        name: 'seek',
        description: '將播放時間設置到另一個位置',
        options: [
            {
                name: 'amount',
                type: 10,
                description: '您想跳轉到的時間（以秒為單位）',
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
        const args = interaction.options.getNumber('amount');
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
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
        const time = parseInt(args);
        if (!time) return interaction.reply({ content: '請指定時間，時間以秒為單位。' });
        if (time >= queue.songs[0].duration) return interaction.reply({ content: `時間： \`${queue.songs[0].duration} 秒\`` });
        client.distube.seek(interaction, Number(args));
        const embed = new Discord.MessageEmbed()
            .setDescription(`跳轉到 \`${args} 秒\``)
            .setColor('RANDOM');
        return interaction.reply({ embeds: [embed] });
    },
};
