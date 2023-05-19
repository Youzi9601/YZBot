const { useMasterPlayer, QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-autoplay",
    // disabled: true,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {
        const player = useMasterPlayer();
        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.node.isPlaying()) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("無法設定自動播放")
                    .setDescription(`當前沒有進行中的曲目或是樂曲已暫停`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        const action = (queue.repeatMode === QueueRepeatMode.AUTOPLAY) ? QueueRepeatMode.OFF : QueueRepeatMode.AUTOPLAY;
        queue.setRepeatMode(action);

        return interaction.followUp({
            content: `自動播放 ${action === QueueRepeatMode.OFF ? "禁用" : "啟用"}! ✅`,
        });
    },
};
