const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    name: 'help-basic',
    run: async (client, interaction, container) => {
    // 執行內容
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('幫助列表')
            .setDescription('請選擇以下選單來叫出相關命令！');

        await interaction.reply({
            ephemeral: true,
            embeds: [embed],
        });
    },
};
