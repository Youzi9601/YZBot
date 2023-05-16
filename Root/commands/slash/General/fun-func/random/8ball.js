const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time } = require('discord.js');
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
    const data = client.language_data(interaction.locale, 'command-response');
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun/8ball');

    const items = data['8ball'];
    const random = items[Math.floor(Math.random() * items.length)];
    let msg = new EmbedBuilder()
        .setAuthor({
            iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
            name: translations["embed_author_name"].replace('{{botname}}', client.user.username),
        })
        .addFields(
            {
                name: translations["embed_response"],
                value: `${random}`,
            },
            {
                name: translations["embed_question"],
                value: `||${interaction.options.getString('question') || client.language_data(interaction.locale, 'placeholder#null')}||`,
            },
        )
        .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
        })
        .setTimestamp()
        .setColor('Random');
    // 騙人把戲
    if (random == 'error_1') {
        msg = new EmbedBuilder()
            .setAuthor({
                iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                name: translations["embed_author_name"].replace('{{botname}}', client.user.username),
            })
            .addFields(
                {
                    name:  translations["embed_response"],
                    value: translations["error_1_troll"],
                },
                {
                    name: translations["embed_question"],
                    value: `||${interaction.options.getString('question') || client.language_data(interaction.locale, 'placeholder#null')}||`,
                },
            )
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0xf24e43);
        await interaction.reply(translations["error_1_replyerror"]);
        await sleep(3000);
        await interaction.followUp({
            embeds: [msg],
            // ephemeral: true,
        });

    } else await interaction.reply(
        {
            embeds: [msg],
            // ephemeral: true,
        },
    );
}