const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time } = require('discord.js');
const { random } = require('mathjs');
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
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
async function load(client, interaction, config, db) {
    const member = interaction.options.getMember('member') || interaction.member;
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#random.gay');

    let msg = new EmbedBuilder()
        .setAuthor({
            iconURL: `${interaction.user.displayAvatarURL({ dynamic: true }) || interaction.user.defaultAvatarURL}`,
            name: interaction.user.tag,
        })
        .setDescription(
            translations["embed_response"]
                .replace('{{member}}', `${ member }`)
                .replace('{{persent}}', ` \`${ random(0, 100).toFixed(0) }%\` `),
        )
        .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
        })
        .setTimestamp()
        .setColor('Random');
    await interaction.reply({ embeds:[msg] });
}