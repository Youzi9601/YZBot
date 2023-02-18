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
    run: async (client, interaction, config, db) => {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(client.ws.ping + "ms!")
                    .setColor('Blue'),
            ],
            ephemeral: true,
        })
    },
};

