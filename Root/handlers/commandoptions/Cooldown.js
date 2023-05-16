/**
 * 此檔案待修復(修正部分DB設定問題)
 */
const humanizeDuration = require('humanize-duration');
const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {*} config
 * @param {import('./../../handlers/database/db_function')} db
 * @param {*} command
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.cooldown) return false;
    const interactionType = 'Normal';
    const currentTime = Date.now();
    const user = interaction.member.user;
    const cooldown = command.cooldown;
    // 時間
    const human_time = humanizeDuration(command.cooldown, {
        conjunction: ', ',
        language: 'zh_TW',
    });
    let data = await db.get(
        client,
        'CooldownSystem',
        `${interaction.guild.id}`,
    );
    const oldTime = Number(
        (
            data[command.data.name] ?
                (
                    data[command.data.name][interactionType ?? 'Normal'] ?
                        data[command.data.name][interactionType ?? 'Normal'][user.id]
                        : undefined
                ) : undefined
        ) ?? 0,
    );

    if (Math.floor(currentTime - oldTime) >= cooldown || oldTime == 0) {
        if (!data[command.data.name]) {
            data[command.data.name] = {};
        }
        if (!data[command.data.name][interactionType ?? 'Normal']) {
            data[command.data.name][interactionType ?? 'Normal'] = {};
        }
        data[command.data.name][interactionType ?? 'Normal'][user.id] = currentTime;
        await db.set(
            client,
            'CooldownSystem',
            `${interaction.guild.id}`,
            data,
        );
        return false;
    } else if (command.returnCooldown == false || command.returnNoErrors) return true;
    else {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.user.tag,
                        iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                    })
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43)
                    .setDescription(
                        `你目前處於冷卻狀態，請等待\`${human_time}\`！\n直到 <t:${Math.floor(
                            Math.floor(oldTime + cooldown) / 1000,
                        )}> ！`,
                    ),
            ],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
        return true;
    }
};
