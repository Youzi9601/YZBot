const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.OnlyRunOnGuilds) return false;
    if (command.returnOnlyRunOnGuilds == false || command.returnNoErrors)
        return true;
    // 判斷是否於guild執行
    if (interaction.inGuild() == false) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xf24e43)
                    .setTitle('無法使用')
                    .setDescription('此 \`[ / ]斜線命令\` 無法於非伺服器之頻道中做使用！')
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp(),
            ],
            ephemeral: true,
        });
        return true;
    } else return false;
};
