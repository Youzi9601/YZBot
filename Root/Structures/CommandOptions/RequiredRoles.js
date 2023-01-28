const { config } = require('./../../../bot');
module.exports = async function(message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.requiredRoles) return false;
    const missing = [];
    command.requiredRoles.forEach(role => {
        if (!message.member.roles.cache.has(role)) missing.push(`<@&${role}>`);
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnRequiredRoles == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`您需要擁有這些角色才能運行此命令。\n• ${missing.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};