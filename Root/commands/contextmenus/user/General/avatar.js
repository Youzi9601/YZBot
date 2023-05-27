const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('取得頭像')
        .setType(ApplicationCommandType.User)
        .toJSON(),
    disabled: true,
    /**
     *
     * @param {import('./../../../../bot').client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
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
            );


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
                        ))
                        .setFooter({
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                        })
                        .setTimestamp()
                        .setColor(0x0098d9),
                ],
                components: [row],
                ephemeral: true,
            },
        );

    },
};
