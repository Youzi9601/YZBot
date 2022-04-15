module.exports = async function(message, command, Discord) {
    if (!command.OnlyRunOnGuilds) return false;
    if (command.returnOnlyRunOnGuilds == false || command.returnNoErrors)
        return true;
    // 判斷是否於guild執行
    if (message.inGuild() == false) {
        message.reply({
            embeds: [
                new Discord.MessageEmbed()
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
