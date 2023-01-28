const { translate_Permissions } = require('../../Language/Language');

module.exports = async function(message, command, Discord) {
    if (!command.anyClientPermission) return false;
    if (command.anyClientPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyClientPermissions == false || command.returnNoErrors) return true;
        else {
            const perm = [];
            for (let i = 0; i < command.anyClientPermissionF.length; i++) {
                const ver = command.anyClientPermission[i];
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
                    .setDescription(`我需要這些權限中的任何一項才能執行此命令。\n• ${perm.join('\n• ')}`)],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        }
        return true;
    }
};