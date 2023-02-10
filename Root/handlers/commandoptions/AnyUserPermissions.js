const { config } = require('./../../bot');
const { translate_Permissions } = require('../../Language/Language');
const { EmbedBuilder } = require('discord.js')


module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => interaction.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
        else {
            const perm = [];
            for (let i = 0; i < command.anyUserPermission.length; i++) {
                const ver = command.anyUserPermission[i];
                perm.push(translate_Permissions(ver, 'zh-TW'));
            }
            interaction.reply({
                embeds: [new EmbedBuilder
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
            });
        }
        return true;
    }
};