const { config } = require('./../../../bot');
module.exports = async function(client, message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.onlyUsers) return false;
    if (command.onlyUsers.some(i => i == message.member.user.id)) return false;
    else {
        const onlyUsers = [];
        command.onlyUsers.forEach(id => {
            onlyUsers.push(`<@${id}>`);
        });
        if (command.returnOnlyUsers == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`此命令只能由這些人運行。\n• ${onlyUsers.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};