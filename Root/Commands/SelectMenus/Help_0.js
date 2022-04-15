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
    name: 'help-menu',
    run: async (client, interaction, container) => {
        console.log('hi');
        const embed = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('幫助選單');
        //
        interaction.reply([embed]);
    },
};
