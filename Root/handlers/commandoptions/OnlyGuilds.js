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
    if (!command.setting.options.onlyGuilds) return false;
    if (command.setting.options.onlyGuilds.some((id) => id == interaction.guild.id)) return false;
    else {
        const onlyGuilds = [];
        command.setting.options.onlyGuilds.forEach((id) => {
            onlyGuilds.push(client.guilds.cache.get(id).name);
        });
        if (command.setting.options.returnOnlyGuilds == false || command.setting.options.returnNoErrors)
            return true;
        else
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
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
                        .setDescription(
                            `此命令只能在這些公會中運行。\n• ${ onlyGuilds.join('\n• ') }`,
                        ),
                ],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
        return true;
    }
};
