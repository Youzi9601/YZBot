const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-previous",
    // disabled: true,
    /**
     *
     * @param {import('./../../../bot').client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {
        const player = useMasterPlayer();
        await interaction.deferReply({ ephemeral: true });

        const queue = player.nodes.get(interaction.guildId);
        if (!queue) return client.error.DEFAULT_ERROR(interaction);
        if (!queue.history.previousTrack) return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("無法回到前一首")
                    .setDescription(`沒有前一首曲目`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        await queue.history.back();
        await interaction.followUp({
            content:`✅ 播放**上一首**曲目`,
        });
    },
};
