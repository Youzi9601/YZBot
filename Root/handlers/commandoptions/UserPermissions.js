const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('./../../bot').client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function (client, interaction, config, db, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.setting.options.userPermissions) return false;
    const missing = [];
    const language = client.language_data(interaction.locale, 'discord#Permissions');

    command.setting.options.userPermissions.forEach(i => {
        if (!interaction.member.permissions.has(i)) missing.push(language[i]);
    });
    if (missing.length == 0) return false;
    else {
        if (command.setting.options.returnUserPermissions == false || command.setting.options.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setColor(0xf24e43)
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                })
                .setTimestamp()
                .setDescription(`您需要擁有這些權限才能運行此命令。\n• ${ missing.join('\n• ') }`)],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
        return true;
    }
};