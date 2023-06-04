/**
 * @deprecated 尚未完工
 */
const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder, ButtonStyle, User } = require('discord.js');


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
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#game.tic-tac-toe');
    // translations["embed_author_name"].replace('{{botname}}', client.user.username);

    await interaction.deferReply();

    let member = interaction.options.getMember('member');

    // AI 與玩家對戰
    if (member.id == client.user.id) {

        await require('./tic-tac-toe-func/playWithAi')(client, interaction);
        // 是機器人且非自己
    } else if (member.user.bot) {
        return await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(translations["embed_title_error_isBot"])
                    .setDescription(translations["embed_description_error_isBot"])
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL })
                    .setColor(0xf24e43),
            ],
        });

        // 是真人
    } else {
        await require('./tic-tac-toe-func/playWithMember')(client, interaction);
    }

}