const { useMasterPlayer, QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-loop",
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
        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.node.isPlaying()) return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("無法設定重複模式")
                    .setDescription(`當前沒有進行中的曲目或是樂曲已暫停`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        switch (queue.repeatMode + 1) {
        case QueueRepeatMode.TRACK: {
            queue.setRepeatMode(QueueRepeatMode.TRACK);

            return await interaction.followUp({
                content: '重複模式**啟用**｜當前**`歌曲`**將無限重複🔁',
            });
        }

        case QueueRepeatMode.QUEUE: {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);

            return await interaction.followUp({
                content: '重複模式**啟用**｜整個**`列表`**將無限重複🔁',
            });
        }

        case QueueRepeatMode.OFF, 3: {
            queue.setRepeatMode(QueueRepeatMode.OFF);

            return await interaction.followUp({
                content: '重複模式**禁用**',
            });
        }
        }
    },
};
