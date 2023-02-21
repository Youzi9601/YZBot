const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "help",
    disabled: true,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").StringSelectMenuInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        const value = interaction.values[0]
        await interaction.reply(value + '是你的選擇')
    // 取得json的數值
    },
};
