const Discord = require('discord.js');

module.exports = {
    command: {
        name: 'filter',
        description: '更改音頻過濾器',
        options: [
            {
                name: 'filter-name',
                type: 3,
                description: '音頻過濾器名稱 | 再次選擇關閉音頻過濾器',
                required: true,
                choices: [
                    {
                        name: '8d',
                        value: '3d',
                    },
                    {
                        name: '低音增強',
                        value: 'bassboost',
                    },
                    {
                        name: '迴聲',
                        value: 'echo',
                    },
                    {
                        name: '卡拉OK',
                        value: 'karaoke',
                    },
                    {
                        name: 'Nightcore',
                        value: 'nightcore',
                    },
                    {
                        name: 'Vaporwave',
                        value: 'vaporwave',
                    },
                    {
                        name: 'Flanger',
                        value: 'flanger',
                    },
                    {
                        name: 'Gate',
                        value: 'gate',
                    },
                    {
                        name: '哈斯',
                        value: 'haas',
                    },
                    {
                        name: 'Reverse',
                        value: 'reverse',
                    },
                    {
                        name: '環繞',
                        value: 'surround',
                    },
                    {
                        name: 'Mcompand',
                        value: 'mcompand',
                    },
                    {
                        name: 'Phaser',
                        value: 'phaser',
                    },
                    {
                        name: '顫音',
                        value: 'tremolo',
                    },
                    {
                        name: 'Earwax',
                        value: 'earwax',
                    },
                ],
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
        const queue = await client.distube.getQueue(interaction);
        const choose = interaction.options.getString('filter-name');
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
        await client.distube.setFilter(interaction, choose);
        const filterembed = new Discord.MessageEmbed()
            .setDescription(`當前列隊過濾器： ${queue.filters.join(', ') || '關閉'}`)
            .setColor('RANDOM');
        return interaction.reply({ embeds: [filterembed] });
    },
};
