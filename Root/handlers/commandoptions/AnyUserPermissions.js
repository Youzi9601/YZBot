const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('./../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function(client, interaction, config, db, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.setting.options.anyUserPermission) return false;
    if (command.setting.options.anyUserPermission.some(i => interaction.member.permissions.has(i))) return false;
    else {
        if (command.setting.options.returnAnyUserPermissions == false || command.setting.options.returnNoErrors) return true;
        else {
            const perm = [];
            const language = client.language_data(interaction.locale, 'discord#Permissions');

            for (let i = 0; i < command.setting.options.anyUserPermission.length; i++) {
                const ver = command.setting.options.anyUserPermission[i];
                perm.push(language[ver]);
            }
            interaction.reply({
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
                    .setDescription(`您需要其中任何一種權限才能運行此命令。\n• ${ perm.join('\n• ') }`)],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
        }
        return true;
    }
};