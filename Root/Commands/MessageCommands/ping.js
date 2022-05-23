module.exports = {
    name: 'ping',
    ignoreFile: true,
    run: async (client, message, args, container) => {
        const ping = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('🏓| Pong! 延遲資訊')
            .setDescription(
                `🏠| Websocket 延遲: ${client.ws.ping}ms\n🤖| 機器人延遲: ${Date.now() - message.createdTimestamp
                }ms`,
            );
        message.reply({
            embeds: [ping],
            allowedMentions: {
                repliedUser: false,
            },
        });
    },
};
