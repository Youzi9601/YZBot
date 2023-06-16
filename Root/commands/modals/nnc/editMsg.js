const { EmbedBuilder } = require("discord.js");


module.exports = {
    id: "nnc-edit",
    disabled: true,
    /**
     *
     * @param {import('./../../bot').client} client
     * @param {import("discord.js").ModalSubmitInteraction} interaction
     * @param {import("../../../Config")} config
     * @param {import("quick.db").QuickDB} db
     * @returns "?"
     */
    run: async (_client, interaction, _config, _db) => {
        throw '當前無法編輯訊息';

        // return await interaction.reply({
        //     embeds: [
        //         new EmbedBuilder()
        //             .setDescription('模式正在工作！這是您輸入的內容：' + interaction.fields.getTextInputValue('something')),
        //     ],
        //     ephemeral: true,
        // });

    },
};
