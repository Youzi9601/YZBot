const { config } = require('./../../../bot');
module.exports = async function(message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.onlyChannels) return false;
    if (command.onlyChannels.some(id => id == message.channel.id)) return false;
    else {
        const onlyChannels = [];
        command.onlyChannels.forEach(id => {
            onlyChannels.push(`<#${id}>`);
        });
        if (command.returnOnlyChannels == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`此命令只能在這些頻道中運行。\n• ${onlyChannels.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};