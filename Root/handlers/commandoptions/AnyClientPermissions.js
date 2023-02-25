const { EmbedBuilder } = require('discord.js');

module.exports = async function(client, interaction, config, db, command) {
    if (!command.anyClientPermission) return false;
    if (command.anyClientPermission.some(i => interaction.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyClientPermissions == false || command.returnNoErrors) return true;
        else {
            const perm = [];
            const language = client.language_data(interaction.locale, 'discord').Permissions;

            for (let i = 0; i < command.anyClientPermissionF.length; i++) {
                const ver = command.anyClientPermission[i];
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
                    .setDescription(`我需要這些權限中的任何一項才能執行此命令。\n• ${perm.join('\n• ')}`)],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        }
        return true;
    }
};