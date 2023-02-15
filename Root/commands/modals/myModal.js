const { EmbedBuilder } = require("discord.js");

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {import("../../../Config")} config
 * @param {import("quick.db").QuickDB} db
 * @returns "?"
 */
module.exports = {
    id: "myModal",
    run: async (_client, interaction, _config, _db) => {

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('模式正在工作！這是您輸入的內容：' + interaction.fields.getTextInputValue('something')),
            ],
            ephemeral: true,
        });

    },
};
