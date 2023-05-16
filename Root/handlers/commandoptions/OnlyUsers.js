const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function(client, interaction, config, db, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.onlyUsers) return false;
    if (command.onlyUsers.some(i => i == interaction.member.user.id)) return false;
    else {
        const onlyUsers = [];
        command.onlyUsers.forEach(id => {
            onlyUsers.push(`<@${id}>`);
        });
        if (command.returnOnlyUsers == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setColor(0xf24e43)
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                })
                .setTimestamp()
                .setDescription(`此命令只能由這些人運行。\n• ${onlyUsers.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
        return true;
    }
};