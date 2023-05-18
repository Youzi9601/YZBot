const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "audioTrackAdd",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').Track} track
     */
    async execute(client, queue, track) {

        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.audioTrackAdd');

        await queue.metadata.sendTyping();

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`${track.requestedBy} ${translations["description"]} [\`${ track.title }\`](${ track.source })  — ${ track.author }`)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0xf24e43);

        await queue.metadata.send({
            embeds: [embed],
            allowedMentions:{ users:[] },
        });
    },
};
