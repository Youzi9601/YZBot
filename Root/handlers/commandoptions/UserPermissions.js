const { config } = require('./../../../bot');
const { EmbedBuilder } = require('discord.js')
const { translate_Permissions } = require('../../Language/Language');

module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.userPermissions) return false;
    const missing = [];
    command.userPermissions.forEach(i => {
        if (!interaction.member.permissions.has(i)) missing.push(translate_Permissions(i, 'zh-TW'));
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnUserPermissions == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
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