module.exports = async function(message, command, Discord) {
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`您需要其中任何一種權限才能運行此命令。\n• ${command.anyUserPermission.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};