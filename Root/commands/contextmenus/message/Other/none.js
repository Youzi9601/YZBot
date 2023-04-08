const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment');


module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('none')
        .setType(ApplicationCommandType.Message)
        .toJSON(),
    disabled: true,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        // 內容

    },
};
