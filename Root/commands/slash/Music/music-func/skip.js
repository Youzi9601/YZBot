const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
module.exports = { load };
/**
     *
     * @param {import('./../../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    const player = useMasterPlayer();
    await interaction.deferReply();

    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) return interaction.followUp({
        embeds: [
            new EmbedBuilder()
                .setTitle("無法跳過")
                .setDescription(`沒有進行中的曲目`)
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                })
                .setTimestamp()
                .setColor(0xf24e43),
        ],
    });

    const success = queue.node.skip();

    return interaction.followUp({
        content: success ?
            `✅ 已跳過此首歌曲` :
            `❌ ${interaction.member}，發生了預料之外的錯誤。再試一次?`,
    });
}