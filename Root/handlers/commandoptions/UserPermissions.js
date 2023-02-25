const { EmbedBuilder } = require('discord.js');


module.exports = async function(client, interaction, config, db, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.userPermissions) return false;
    const missing = [];
    const language = client.language_data(interaction.locale, 'discord').Permissions;

    command.userPermissions.forEach(i => {
        if (!interaction.member.permissions.has(i)) missing.push(language[i]);
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnUserPermissions == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder()
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
            ephemeral: true,
        });
        return true;
    }
};