const { translate_Permissions } = require('../../Language/Language');
const {EmbedBuilder} = require('discord.js')
/**
 *
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').Integration} interaction 
 */
module.exports = async function(client, interaction, command) {
    if (!command.clientPermissions) return false;
    const missing = [];
    interaction.clientPermissions.forEach(i => {
        if (!interaction.guild.me.permissions.has(i)) missing.push(translate_Permissions(i, 'zh-TW'));
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