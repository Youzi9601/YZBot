const { config } = require('./../../../bot');
module.exports = async function(message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.requiredAnyRole) return false;
    if (command.requiredAnyRole.some(i => message.member.roles.cache.has(i))) return false;
    else {
        const requiredRoles = [];
        command.requiredAnyRole.forEach(i => requiredRoles.push(`<@&${i}>`));
        if (command.returnRequiredAnyRole == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`您需要具有這些角色中的任何一個才能運行此命令。\n• ${requiredRoles.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};
