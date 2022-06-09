const { config } = require('./../../../bot');
module.exports = async function(client, message, command, Discord) {
    // bypass
    if (config.developers.some(id => message.member.user.id == id)) return false;
    //
    if (!command.onlyGuilds) return false;
    if (command.onlyGuilds.some((id) => id == message.guild.id)) return false;
    else {
        const onlyGuilds = [];
        command.onlyGuilds.forEach((id) => {
            onlyGuilds.push(client.guilds.cache.get(id).name);
        });
        if (command.returnOnlyGuilds == false || command.returnNoErrors)
            return true;
        else
            message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({
                            name: message.member.user.tag,
                            iconURL: message.member.user.displayAvatarURL({ dynamic: true }) || message.member.user.defaultAvatarURL,
                        })
                        .setColor('#FF0000')
                        .setTimestamp()
                        .setDescription(
                            `此命令只能在這些公會中運行。\n• ${onlyGuilds.join('\n• ')}`,
                        ),
                ],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        return true;
    }
};
