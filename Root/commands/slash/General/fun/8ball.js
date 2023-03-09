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
    const items = data['8ball'];
    const random = items[Math.floor(Math.random() * items.length)];
    let msg = new EmbedBuilder()
        .setAuthor({
            iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
            name: client.user.username + '之神奇的8號球',
        })
        .addFields(
            {
                name: '回應',
                value: `${random}`,
            },
            {
                name: '原問題',
                value: `||${interaction.options.getString('question') || '無'}||`,
            },
        )
        .setColor('Random');
    // 騙人把戲
    if (random == 'error_1') {
        msg = new EmbedBuilder()
            .setAuthor({
                iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                name: client.user.username + '之神奇的8號球',
            })
            .addFields(
                {
                    name: '回應',
                    value: '剛才的是騙你的！(awa',
                },
                {
                    name: '原問題',
                    value: `||${interaction.options.getString('question') || '無'}||`,
                },
            )
            .setColor('Random');
        await interaction.reply(':x: 此指令交互失敗');
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