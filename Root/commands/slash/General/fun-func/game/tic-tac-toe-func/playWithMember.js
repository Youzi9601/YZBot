const { userMention, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder, ButtonStyle, User } = require('discord.js');

/**
 * 與玩家對戰
 * @param {import('./../../../../../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const translations = client.language_data(interaction.locale, 'commands/slash/General/fun#game.tic-tac-toe');

    const message = await interaction.fetchReply();

    const player1 = interaction.member;
    const player2 = interaction.options.getMember('member');
    const customids = {
        p1: `tic-tac-toe-1p_Ready-${ interaction.createdTimestamp }`,
        p2: `tic-tac-toe-2p_Ready-${ interaction.createdTimestamp }`,
    };

    const users_id = [player1.id];
    if (player1.id != player2.id) users_id.push(player2.id);
    await interaction.editReply({
        content: `${ userMention(player2.id) }\n${ translations["content_waitForOtherMember"] }`,
        embeds: [
            new EmbedBuilder()
                .setTitle(translations["embed_title_vs_beforeGame"])
                .setDescription(translations["embed_description_vs_beforeGame"])
                .setColor(0xf6c42f)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL }),
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(customids.p1)
                        .setEmoji('❌')
                        .setLabel(`${ player1.user.username }`)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(customids.p2)
                        .setEmoji('⭕')
                        .setLabel(`${ player2.user.username }`)
                        .setStyle(ButtonStyle.Primary),
                ),
        ],
        allowedMentions: { users: users_id },
    });

    const unreadys = {
        p1: true,
        p2: true,
    };

    // 創建蒐集等待兩位玩家都完成準備
    const collector_beforeStart = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: async (button) => {

            if ((button.user.id === player1.user.id &&
                button.customId === customids.p1) ||
                (button.user.id === player2.user.id &&
                    button.customId === customids.p2)) {
                await button.deferUpdate();
                return true;
            } else return false;
        },
        time: 30 * 1000, // 偵測時間
    });


    collector_beforeStart.on('collect', async (button) => {
        // console.log("OWO 觸發了");
        // 檢查收集資訊
        if (button.customId === customids.p1 && button.user.id === player1.user.id) {


            await button.editReply({
                embeds: [
                    EmbedBuilder.from((await interaction.fetchReply()).embeds[0])
                        .setDescription(translations["embed_description_vs_beforeGame"])],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[0])
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[1]),
                        ),
                ],
                allowedMentions: { users: users_id },
            });
            unreadys.p1 = false;
        } else if (button.customId === customids.p2 && button.user.id === player2.user.id) {
            await button.editReply({
                embeds: [
                    EmbedBuilder.from((await interaction.fetchReply()).embeds[0])
                        .setDescription(translations["embed_description_vs_beforeGame"])],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[0]),
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[1])
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                        ),
                ],
                allowedMentions: { users: users_id },
            });
            unreadys.p2 = false;
        }


        // 檢查兩位是否都到就開始
        if (!unreadys.p1 && !unreadys.p2) {
            collector_beforeStart.stop('雙方皆完成準備');
            require('./system')('vs', client, message, { p1: player1, p2: player2 });
        }

    });

    collector_beforeStart.on('end', async (_c) => {
        if (unreadys.p1 || unreadys.p2) {
            await message.edit({
                embeds: [
                    EmbedBuilder.from((await interaction.fetchReply()).embeds[0])
                        .setDescription(translations["embed_description_vs_timedout"])],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[0])
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            ButtonBuilder.from((await interaction.fetchReply()).components[0].components[1])
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        ),
                ],
            });
        }
    });
    // setTimeout(async ()=>{

    // }, 30 * 1000)

};