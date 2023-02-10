const { config } = require('./../../bot');
const { EmbedBuilder } = require('discord.js')

module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.requiredAnyRole) return false;
    if (command.requiredAnyRole.some(i => interaction.member.roles.cache.has(i))) return false;
    else {
        const requiredRoles = [];
        command.requiredAnyRole.forEach(i => requiredRoles.push(`<@&${i}>`));
        if (command.returnRequiredAnyRole == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
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
