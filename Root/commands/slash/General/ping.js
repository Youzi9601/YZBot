const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('回傳機器人的狀態')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Main', 'General'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        await interaction.deferReply({ ephemeral: true });
        const ping = new EmbedBuilder()
            .setColor('Random')
            .setTimestamp()
            .setTitle('🏓| Pong! 機器人狀態')
            .setDescription([
                `🏠| Websocket 延遲: ${client.ws.ping}ms`,
                `🤖| #${client.shard.ids}區 機器人延遲: ${Math.abs(Date.now() - interaction.createdTimestamp)}ms`,
                '',
            ].join('\n'),
            );
        return await interaction.editReply({
            embeds: [ping],
            ephemeral: true,
        })
    },
};

