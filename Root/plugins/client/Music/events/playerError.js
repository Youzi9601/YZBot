const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "playerError",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').PlayerError} error
     */
    async execute(client, queue, error) {
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.playerError');

        client.console('Error', `[ERROR] 發生了 discord-player 錯誤：${error.message}`.red);
        client.console('Error', undefined, undefined, undefined, error);
        await queue.metadata.channel.sendTyping();
        await queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(translations["title"])
                    .setDescription(`${translations["description"]}\n\`\`\`- ${error.message}\`\`\``)
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ] });
    },
};
