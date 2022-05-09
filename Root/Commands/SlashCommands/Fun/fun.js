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
    command: {
        name: 'fun',
        description: '遊戲系列',
        options: [],
    },
    ignoreFile: true,
    run: async (client, interaction, container) => {
        // 內容
        interaction.editreply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        })
    },
};