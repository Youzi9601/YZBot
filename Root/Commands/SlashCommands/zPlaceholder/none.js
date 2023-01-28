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
        name: 'none',
        description: '一個未知的命令',
    },
    ownerOnly: true,
    ignoreFile: true,
    run: async (client, interaction, container) => {
        // 內容
    },
};