const Discord = require('discord.js');
const progressbar = require('string-progressbar');

module.exports = {
    command: {
        name: 'volume',
        description: '更改播放的音量。',
        options: [
            {
                name: 'amount',
                type: 10,
                description: '音量百分比(數字，1~200)',
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
        const volume = parseInt(args);
        if (volume < 1 || volume > 200) {
            return interaction.reply({ content: '請輸入一個有效的數字（1 到 200 之間）', ephemeral: true });
        }
        await client.distube.setVolume(interaction, volume);
        const total = 200;
        const current = volume;
        const bar = progressbar.splitBar(total, current, 10, '▬', '🔘')[0];
        await interaction.reply(`將新音量設置為 ${volume}%。\n${bar}`);
        const sleep = async (ms) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, ms || 0);
            });
        };
        await sleep(7000);
        return interaction.deleteReply();
    },
};
