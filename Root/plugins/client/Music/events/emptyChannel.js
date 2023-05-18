const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "emptyChannel",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     */
    async execute(client, queue) {
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.emptyChannel');

        await queue.channel.sendTyping();
        await queue.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(translations["title"])
                    .setDescription(`${translations["description"]}`)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ] });
    },
};
