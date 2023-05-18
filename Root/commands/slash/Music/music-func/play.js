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
    if (!channel) return interaction.reply('您未連接到語音頻道！');

    await interaction.deferReply();

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                metadata: interaction.channel,
            },
        });

        return await interaction.editReply(`**${track.title}**排隊！`);
    } catch (e) {

        return await interaction.editReply(`出了點問題：${e}`);
    }
}