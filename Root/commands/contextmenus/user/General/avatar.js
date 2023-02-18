const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "取得頭像",
    type: 2,
    disabled: true,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        const user = interaction.guild.members.cache.get(interaction.targetId);

        const locales = {
            'zh-TW': {
                title: `${ user.user.tag }的頭像：`,
                description: `[[點我下載]](${ user.displayAvatarURL({ dynamic: true }) })`,
                button: `圖片連結`,
            },
            'en': {
                title: `Avatar of ${ user.user.tag }:`,
                description: `[[Download]](${ user.displayAvatarURL({ dynamic: true }) })`,
                button: `Image Link`,
            },
            'es': {
                title: `Avatar de ${ user.user.tag }:`,
                description: `[[Descargar]](${ user.displayAvatarURL({ dynamic: true }) })`,
                button: `Enlace de la imagen`,
            },
            // 更多語言翻譯...
        };


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(user.displayAvatarURL({ dynamic: true }))
                    .setLabel(locales[interaction.locale] ? locales[interaction.locale].button : locales['zh-TW'].button)
                    .setStyle(ButtonStyle.Link),
            )


        return await interaction.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(locales[interaction.locale] ? locales[interaction.locale].title : locales['zh-TW'].title)
                        .setDescription(locales[interaction.locale] ? locales[interaction.locale].description : locales['zh-TW'].description)
                        .setImage(user.displayAvatarURL(
                            {
                                dynamic: true,
                            },
                        )),
                ],
                components: [row],
                ephemeral: true,
            },
        );

    },
};
