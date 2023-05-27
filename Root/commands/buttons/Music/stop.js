const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-stop",
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
                    .setTitle("無法停止")
                    .setDescription(`沒有進行中的曲目`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        await queue.delete();

        return interaction.followUp({ content: "✅ 樂曲已停止，下次見！" });

    },
};
