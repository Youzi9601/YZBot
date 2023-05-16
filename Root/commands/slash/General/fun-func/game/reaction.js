/**
 * @deprecated 尚未完工
 */
const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder } = require('discord.js');
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
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun/reaction');
    translations["embed_author_name"].replace('{{botname}}', client.user.username);

    const embed = new EmbedBuilder()
        .setFooter({ text: client.user.username, iconURL:client.user.displayAvatarURL() || client.user.defaultAvatarURL })
        .setColor(0x41f097);
    await interaction.reply({ embeds:[embed] });

    const delay = Math.floor(Math.random() * 5) + 1;

    setTimeout(() => {
        const filter = (button) => button.clicker.user.id === interaction.author.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 10000, // 偵測時間
        });

        interaction.channel.send('現在開始測試反應時間！', {
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('reaction_button')
                            .setLabel('點擊這裡！')
                            .setStyle('PRIMARY'),
                    ),
            ],
        });

        collector.on('collect', (button) => {
            if (button.customId === 'reaction_button') {
                const reactionTime = button.clickedAt - interaction.createdTimestamp;
                interaction.channel.send(`你的反應時間為 ${reactionTime} 毫秒！`);
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.channel.send('時間已過，你沒有點擊按鈕！');
            }
        });
    }, delay * 1000);


}