const { config } = require('../../../bot');
module.exports = async function(message, command, Discord) {
    if (!command.ownerOnly) return false;
    if (config.developers.some(id => message.member.user.id == id)) return false;
    else {
        if (command.returnOwnerOnly == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription('此命令是為機器人的開發人員所使用的。')],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};