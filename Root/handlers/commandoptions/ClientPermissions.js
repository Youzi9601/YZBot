const { EmbedBuilder } = require('discord.js')
/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Integration} interaction
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.clientPermissions) return false;
    const missing = [];
    const language = client.language.get(interaction.locale + '/' + 'discord')?.Permissions || client.language.get('zh-TW' + '/' + 'discord').Permissions

    interaction.clientPermissions.forEach(i => {
        if (!interaction.guild.me.permissions.has(i)) missing.push(language[i]);
    });
    if (missing.length == 0) return false;
    else {
        if (interaction.returnClientPermissions == false || interaction.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`我需要這些權限才能運行此命令。\n• ${missing.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};