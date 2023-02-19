const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "delete",
    // disabled: true,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        const items = client.language_data(interaction.locale, 'command').delete
        const msg = items[Math.floor(Math.random() * items.length)];
        await interaction.message.edit({
            content: interaction.message.content + `\n${ msg }`,
            allowedMentions: {
                repliedUser: false,
            },
        })
        await wait(2000)
        await interaction.message.delete()
    // 取得json的數值
    },
};
