/**
 * @deprecated 尚未完工
 */
const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder, ButtonStyle } = require('discord.js');
const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
};

module.exports = { load };
/**
     *
     * @param {import('./../../../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#game.reaction');
    // translations["embed_author_name"].replace('{{botname}}', client.user.username);

    const embed = new EmbedBuilder()
        .setTitle(translations["embed_title_start"])
        .setDescription(translations["embed_description_start"])
        .setFooter({ text: client.user.username, iconURL:client.user.displayAvatarURL() || client.user.defaultAvatarURL })
        .setColor(0x41f097);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('reaction_button')
                .setLabel(translations["button_start"])
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
        );
    const message = await interaction.reply({ embeds:[embed], components:[row], fetchReply: true });

    // 延遲
    const delay = Math.floor(Math.random() * 5) + 2;

    setTimeout(async () => {
        /**
         *
         * @param {import("discord.js").ButtonInteraction} button
         * @returns
         */
        const filter = (button) => button.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 10000, // 偵測時間
        });

        await message.edit({
            embeds:[embed.setDescription(translations["embed_description_test"])],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('reaction_button')
                            .setLabel(translations["button_test"])
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(false),
                    ),
            ],
        });

        collector.on('collect', async (button) => {
            if (button.customId === 'reaction_button') {
                const reactionTime = button.createdTimestamp - interaction.createdTimestamp - delay * 1000;
                await button.reply({ content: translations["respond_collect"].replace('{{time}}', reactionTime) });
                await message.edit({
                    embeds:[embed.setDescription(translations["embed_description_test"])],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('reaction_button')
                                    .setLabel(translations["button_test"])
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                            ),
                    ],
                });
            }
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await interaction.followUp({ content: translations["respond_end"] });
                await message.edit({
                    embeds:[embed.setDescription(translations["embed_description_test"])],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('reaction_button')
                                    .setLabel(translations["button_test"])
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                            ),
                    ],
                });
            }
        });
    }, delay * 1000);


}