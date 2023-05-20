const { useMasterPlayer } = require('discord-player');
module.exports = { load };
/**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    const player = useMasterPlayer();
    const query = interaction.options.getString("query");
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content:'您未連接到語音頻道！', ephemeral: true });
    if (player.queues.cache.size > 0) {
        if (interaction.guild.members.me.voice.channelId !== channel.id) {
            return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
        }
    }

    await interaction.deferReply();

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
                selfDeaf: true,
                volume: 100,
                leaveOnEnd: true,
                leaveOnEndCooldown: 10 * 60 * 1000,
                leaveOnStop: false,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 5 * 60 * 1000,
            },
        });

        if (track.queue?.node != undefined) {
            if (!track.queue.node.isPlaying()) await track.queue.node.play();
        }
        return await interaction.editReply(`**${track.title}** 已完成添加！`);
    } catch (e) {

        return await interaction.editReply(`出了點問題：${e}`);
    }
}