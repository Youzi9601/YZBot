const humanizeDuration = require('humanize-duration');
const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Integration} interaction
 * @param {*} config
 * @param {import('quick.db').QuickDB} db
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

    const oldTime =
        (await db.get(
            `CooldownSystem.${interaction.guild.id}.${command.command.name}.${interactionType ?? 'Normal'
            }.${user.id}`,
        )) ?? 0;
    if (Math.floor(currentTime - oldTime) >= cooldown || oldTime == 0) {
        await db.set(
            `CooldownSystem.${interaction.guild.id}.${command.command.name}.${interactionType ?? 'Normal'
            }.${user.id}`,
            currentTime,
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
                    .setTimestamp()
                    .setColor('#FF0000')
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
