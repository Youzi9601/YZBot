const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "music-resume",
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
        if (!queue) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("無法繼續")
                    .setDescription(`沒有進行中的曲目`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
        });

        const resumed = await queue.node.resume();
        return interaction.followUp({
            content: resumed ?
                '▶️播放器已恢復！' :
                `❌${interaction.member} 出錯了...再試一次？`,
        });
    },
};
