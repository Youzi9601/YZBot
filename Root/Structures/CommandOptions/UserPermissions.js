const { config } = require('./../../../bot');
const { translate_Permissions } = require('../../Language/Language');
module.exports = async function(message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.userPermissions) return false;
    const missing = [];
    command.userPermissions.forEach(i => {
        if (!message.member.permissions.has(i)) missing.push(translate_Permissions(i, 'zh-TW'));
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnUserPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`您需要擁有這些權限才能運行此命令。\n• ${missing.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};