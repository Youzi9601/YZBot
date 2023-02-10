const { config } = require('./../../bot');
const { EmbedBuilder } = require('discord.js')

module.exports = async function(client, interaction, command) {
    // bypass
    if (config.developers.some(id => interaction.member.user.id == id)) return false;
    //
    if (!command.onlyChannels) return false;
    if (command.onlyChannels.some(id => id == interaction.channel.id)) return false;
    else {
        const onlyChannels = [];
        command.onlyChannels.forEach(id => {
            onlyChannels.push(`<#${id}>`);
        });
        if (command.returnOnlyChannels == false || command.returnNoErrors) return true;
        else interaction.reply({
            embeds: [new EmbedBuilder
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.member.user.defaultAvatarURL,
                })
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(`此命令只能在這些頻道中運行。\n• ${onlyChannels.join('\n• ')}`)],
            allowedMentions: {
                repliedUser: false,
            },
        });
        return true;
    }
};