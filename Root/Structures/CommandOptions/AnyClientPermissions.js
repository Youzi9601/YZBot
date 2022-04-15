module.exports = async function(message, command, Discord) {
    if (!command.anyClientPermission) return false;
    if (command.anyClientPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyClientPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`我需要這些權限中的任何一項才能執行此命令。\n• ${command.anyClientPermission.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};