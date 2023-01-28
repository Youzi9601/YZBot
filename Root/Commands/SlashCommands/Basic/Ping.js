const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    CommandInteraction,
} = require('discord.js');
const { connection } = require('mongoose');
module.exports = {
    command: {
        name: 'ping',
        description: '檢查機器人是否回應',
    },
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 5000,
    /**
     *
     * @param {import('discord.js').Client} client 機器人
     * @param {CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const ping = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('🏓| Pong! 機器人狀態')
            .setDescription([
                `🏠| Websocket 延遲: ${client.ws.ping}ms`,
                `🤖| 機器人延遲: ${Date.now() - interaction.createdTimestamp}ms`,
                '',
            ].join('\n'),
            );
        interaction.reply({ embeds: [ping] });
    },
};