const { config } = require('./../../../bot');
const {EmbedBuilder} = require('discord.js')

module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.requiredRoles) return false;
    const missing = [];
    command.requiredRoles.forEach(role => {
        if (!interaction.member.roles.cache.has(role)) missing.push(`<@&${role}>`);
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnRequiredRoles == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
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