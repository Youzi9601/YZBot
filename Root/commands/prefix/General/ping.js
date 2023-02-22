const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "ping",
        description: "Replies with pong!",
    },
    permissions: ['SendMessages'],
    owner: false,
    disabled: true,
    run: async (client, message, args, prefix, config, db) => {

        await message.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`🏓 **Pong!** 客戶端 websocket ping： \`${client.ws.ping}\` ms.`)
                .setColor("Green"),
        ] })

    },
};
