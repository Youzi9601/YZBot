const { userMention, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, time, ButtonBuilder, ButtonStyle, User } = require('discord.js');

/**
 * 與機器人對戰
 * @param {import('./../../../../../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#game.tic-tac-toe');

    const player1 = interaction.member;
    const player2 = interaction.guild.members.me;
    const customID = `tic-tac-toe-ai_Ready-${ interaction.createdTimestamp }`;

    const message = await interaction.fetchReply();
    await interaction.editReply({
        content: `${ translations["content_choseAI"] }`,
        embeds: [
            new EmbedBuilder()
                .setTitle(translations["embed_title_ai_beforeGame"])
                .setDescription(translations["embed_description_ai_beforeGame"])
                .setColor(0xf6c42f)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL }),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(customID)
                        .setPlaceholder(translations["embed_title_ai_beforeGame"])
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:easy"])
                                .setValue('ai:easy')
                                .setDescription(translations["ai:easy_description"]),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:hard"])
                                .setValue('ai:hard')
                                .setDescription(translations["ai:hard_description"]),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:extreme"])
                                .setValue('ai:extreme')
                                .setDescription(translations["ai:extreme_description"]),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:easy-change"])
                                .setValue('ai:easy-change')
                                .setDescription(translations["ai:easy_description"]),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:hard-change"])
                                .setValue('ai:hard-change')
                                .setDescription(translations["ai:hard_description"]),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(translations["ai:extreme-change"])
                                .setValue('ai:extreme-change')
                                .setDescription(translations["ai:extreme_description"]),
                        ),
                ),
        ],
    });

    message.awaitMessageComponent(
        {
            componentType: ComponentType.StringSelect,
            filter: async (menu) => {
                if (menu.user.id === player1.user.id &&
                    menu.customId === customID) {
                    await menu.deferUpdate();
                    return true;
                } else return false;
            },
            time: 30 * 1000, // 偵測時間
        },
    )
        .then(async menu => {
            require('./system')(menu.values[0], client, message, { p1: player1, p2: player2 });
        })
        .catch(async _ => {
            await message.edit({
                embeds: [
                    EmbedBuilder.from((await interaction.fetchReply()).embeds[0])
                        .setDescription(translations["embed_description_ai_timedout"])],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            StringSelectMenuBuilder.from((await interaction.fetchReply()).components[0].components[0])
                                .setDisabled(true),
                        ),
                ],
            });
        });
    /*
    // 處理對戰對手
    const embed = new EmbedBuilder()
        .setTitle(translations["embed_title_beforeGame"])
        .setDescription(translations["embed_description_beforeGame"])
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL })
        .setColor(0x41f097);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('reaction_button')
                .setLabel(translations["button_start"])
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
        );
    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

*/

};