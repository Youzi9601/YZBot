const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "audioTrackAdd",
    disabled: false,
    /**
     *
     * @param {import('./../../../../bot').client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').Track} track
     */
    async execute(client, queue, track) {

        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.audioTrackAdd');

        await queue.metadata.channel.sendTyping();

        // ${track.requestedBy || translations["null"]}
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`${translations["description"]} [\`${ track.title }\`](${ track.url })  — ${ track.author }`)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0x41f097);

        await queue.metadata.channel.send({
            embeds: [embed],
            allowedMentions:{ users:[] },
        });
    },
};

