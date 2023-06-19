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
    cooldown: 5,
    /**
     *
     * @param {import('./../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        await interaction.deferReply({ ephemeral: true });
        const ping = new EmbedBuilder()
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setColor(0x0098d9)
            .setTimestamp()
            .setTitle('🏓| Pong! 機器人狀態')
            .setDescription([
                `🏠| Websocket 延遲: ${client.ws.ping}ms`,
                `🤖| 機器人延遲: ${ Math.abs(Date.now() - interaction.createdTimestamp) }ms`,
                `#${ client.shard.ids }區 `,
                '',
            ].join('\n'),
            );
        return await interaction.followUp({
            embeds: [ping],
            ephemeral: true,
        });
    },
};

