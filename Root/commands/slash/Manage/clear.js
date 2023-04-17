const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('清除訊息')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Manage'],
    OnlyRunOnGuilds: true,
    cooldown: 3000,
    disabled: true,
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

        return await interaction.editReply({
            content:'owo? 這沒做完喔',
            ephemeral: true,
        });
    },
};
