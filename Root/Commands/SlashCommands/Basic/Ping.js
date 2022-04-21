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
    name: 'ping',
    description: '檢查機器人是否回應',
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    cooldown: 5000,
    run: async (client, interaction, container) => {
        const ping = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('🏓| Pong! 延遲資訊')
            .setDescription(
                `🏠| Websocket 延遲: ${client.ws.ping}ms\n🤖| 機器人延遲: ${Date.now() - interaction.createdTimestamp
                }ms`,
            );
        interaction.reply({ embeds: [ping] });
    },
};
