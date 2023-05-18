const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: "playerSkip",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').Track} track
     */
    async execute(client, queue, track) {

        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.playerSkip');

        await queue.channel.sendTyping();

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`${translations["description"]}`)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0xf24e43);


        await queue.channel.send({
            embeds: [embed],
        });
    },
};
