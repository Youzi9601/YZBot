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
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => interaction.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
        else {
            const perm = [];
            const language = client.language_data(interaction.locale, 'discord#Permissions');

            for (let i = 0; i < command.anyUserPermission.length; i++) {
                const ver = command.anyUserPermission[i];
                perm.push(language[ver]);
            }
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.user.tag,
                        iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                    })
                    .setColor('#FF0000')
                    .setTimestamp()
                    .setDescription(`您需要其中任何一種權限才能運行此命令。\n• ${perm.join('\n• ')}`)],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
        }
        return true;
    }
};