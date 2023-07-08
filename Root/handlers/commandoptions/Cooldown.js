/**
 * 此檔案待修復(修正部分DB設定問題)
 * @deprecated 此檔案因無法解決資料庫的儲存與相關配套措施所以廢除
 */
const humanizeDuration = require('humanize-duration');
const { EmbedBuilder, Collection, time } = require('discord.js');

/**
 *
 * @param {import('./../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {*} config
 * @param {import('./../../handlers/database/db_function')} db
 * @param {*} command
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.setting.options.cooldown) return false;
    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.setting.options.cooldown ?? defaultCooldownDuration) * 1000;

    // 時間
    const human_time = humanizeDuration(cooldownAmount, {
        conjunction: ', ',
        language: 'zh_TW',
    });

    /*
    const interactionType = 'Normal';
    const currentTime = Date.now();
    const user = interaction.member.user;
    const cooldown = command.setting.options.cooldown;
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
    */
    // if (Math.floor(currentTime - oldTime) >= cooldown || oldTime == 0) {
    if (timestamps.has(interaction.user.id)) {


        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now > expirationTime) {
            /*
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
            */
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            return false;
        } else if (command.setting.options.returnCooldown == false || command.setting.options.returnNoErrors) {
            return true;
        } else {
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
                            `你目前處於冷卻狀態，請等待\`${ human_time }\`！\n直到 ${ time(expirationTime) } ！`,
                        ),
                ],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
            return true;
        }
    } else return false;
};
