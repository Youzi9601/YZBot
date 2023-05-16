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
    if (!command.requiredAnyRole) return false;
    if (command.requiredAnyRole.some(i => interaction.member.roles.cache.has(i))) return false;
    else {
        const requiredRoles = [];
        command.requiredAnyRole.forEach(i => requiredRoles.push(`<@&${i}>`));
        if (command.returnRequiredAnyRole == false || command.returnNoErrors) return true;
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
                .setDescription(`您需要具有這些角色中的任何一個才能運行此命令。\n• ${requiredRoles.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
        return true;
    }
};
