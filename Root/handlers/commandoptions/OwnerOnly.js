const { EmbedBuilder } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('./../../handlers/database/db_function')} db
 */
module.exports = async function(client, interaction, config, db, command) {
    if (!command.ownerOnly) return false;
    if (client.config.developers.some(id => interaction.member.user.id == id)) return false;
    else {
        if (command.returnOwnerOnly == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription('此命令是為機器人的開發人員所使用的。')],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
        return true;
    }
};