const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder, ButtonStyle, User } = require('discord.js');

/**
 * 與機器人對戰
 * @param {import('./../../../../../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#game.tic-tac-toe');
    if (client) throw '啊喔... 我這遊戲還沒製作完成喔(´-ω-`)';
    return await interaction.reply({
        content: '發生了錯誤：因為昨日(06/24)的Discord炸了，所以 柚子Youzi 就沒寫AI的部分了XD',
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