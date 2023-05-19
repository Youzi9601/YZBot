const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-pause",
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
        await interaction.deferReply({ ephemeral:true });

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.node.isPlaying()) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("無法暫停")
                    .setDescription(`當前列表為暫停狀態或是沒有進行中的曲目`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        const paused = await queue.node.pause();
        return interaction.followUp({
            content: paused ?
                '⏸ 暫停音樂' :
                `❌ ${interaction.member} 出錯了...再試一次？ `,
        });
    },
};
