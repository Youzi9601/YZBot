const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-stop",
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

        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.node.isPlaying()) return client.error.DEFAULT_ERROR(interaction);

        await queue.delete();

        return interaction.followUp({ content: "✅ 樂曲已停止，下次見！" });

    },
};
