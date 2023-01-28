const { config } = require('./../../../bot');
const { translate_Permissions } = require('../../Language/Language');

module.exports = async function(message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
        else {
            const perm = [];
            for (let i = 0; i < command.anyUserPermission.length; i++) {
                const ver = command.anyUserPermission[i];
                perm.push(translate_Permissions(ver, 'zh-TW'));
            }
            message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor({
                        name: message.member.user.tag,
                        iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
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