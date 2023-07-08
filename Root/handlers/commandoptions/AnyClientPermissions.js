const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('./../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.setting.options.anyClientPermission) return false;
    if (command.setting.options.anyClientPermission.some(i => interaction.guild.members.me.permissions.has(i))) return false;
    else {
        if (command.setting.options.returnAnyClientPermissions == false || command.setting.options.returnNoErrors) return true;
        else {
            const perm = [];
            const language = client.language_data(interaction.locale, 'discord#Permissions');

            for (let i = 0; i < command.anyClientPermissionF.length; i++) {
                const ver = command.setting.options.anyClientPermission[i];
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
                    .setDescription(`我需要這些權限中的任何一項才能執行此命令。\n• ${ perm.join('\n• ') }`)],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
        }
        return true;
    }
};