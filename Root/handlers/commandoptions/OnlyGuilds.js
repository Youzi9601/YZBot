const { config } = require('./../../../bot');
const {EmbedBuilder} = require('discord.js')


module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.onlyGuilds) return false;
    if (command.onlyGuilds.some((id) => id == interaction.guild.id)) return false;
    else {
        const onlyGuilds = [];
        command.onlyGuilds.forEach((id) => {
            onlyGuilds.push(client.guilds.cache.get(id).name);
        });
        if (command.returnOnlyGuilds == false || command.returnNoErrors)
            return true;
        else
            interaction.reply({
                embeds: [
                    new EmbedBuilder
                        .setAuthor({
                            name: interaction.member.user.tag,
                            iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
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
