const { EmbedBuilder } = require('discord.js');

module.exports = async function(client, interaction, config, db, command) {
    if (!command.OnlyRunOnGuilds) return false;
    if (command.returnOnlyRunOnGuilds == false || command.returnNoErrors)
        return true;
    // 判斷是否於guild執行
    if (interaction.inGuild() == false) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('無法使用')
                    .setDescription('命令無法於非伺服器中做使用！')
                    .setFooter({ text: '[ / ] 斜線命令' }),
            ],
            ephemeral: true,
        });
        return true;
    } else return false;
};
