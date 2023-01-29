const { EmbedBuilder } = require("discord.js");
const client = require("./../../../bot");
const config = require("./../../../Config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "interactionCreate",
};

client.on('interactionCreate', async (interaction) => {

    // Slash
    if (interaction.isChatInputCommand()) {
        const command = client.slash_commands.get(interaction.commandName);
        await require('./../../handlers/commandoptions/loadCommandOptions')(client, interaction, config, db,command);

        if (!command) return;

        try {
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        }
    }

    // Users
    if (interaction.isUserContextMenuCommand()) {
        const command = client.user_commands.get(interaction.commandName);

        if (!command) return;

        try {
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        }
    }

    // Message:
    if (interaction.isMessageContextMenuCommand()) {
        const command = client.message_commands.get(interaction.commandName);

        if (!command) return;

        try {
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        }
    }

    // Modals:
    if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);

        if (!modal) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('出了點問題……模態處理程序中可能未定義模態 ID。')
                        .setColor('Red'),
                ],
                ephemeral: true,
            });
        }

        try {
            modal.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        }
    }
});

