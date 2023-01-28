const { translate_Permissions } = require('../../Language/Language');

module.exports = async function(message, command, Discord) {
    if (!command.clientPermissions) return false;
    const missing = [];
    command.clientPermissions.forEach(i => {
        if (!message.guild.me.permissions.has(i)) missing.push(translate_Permissions(i, 'zh-TW'));
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnClientPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`我需要這些權限才能運行此命令。\n• ${missing.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};