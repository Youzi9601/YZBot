const progressbar = require('string-progressbar');

module.exports = {
    name: 'music_volume_up',
    returnNoErrors: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ButtonInteraction} interaction
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
            const queueError = new container.Discord.MessageEmbed()
                .setDescription(':x: 啊喔...沒有東西在列隊裡播放')
                .setColor('RANDOM');
            return interaction.reply({ embeds: [queueError] });
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
        }
        const args = queue.volume + 10;
        const volume = parseInt(args);
        if (volume < 1 || volume > 200) {
            return interaction.reply({ content: '這是一個無效的命令（超過 200% ！）', ephemeral: true });
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