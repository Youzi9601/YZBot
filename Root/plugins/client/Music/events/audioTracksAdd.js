const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "audioTracksAdd",
    disabled: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord-player').GuildQueue} queue
     * @param {import('discord-player').Track[]} tracks
     */
    async execute(client, queue, tracks) {
        const translations = client.language_data(queue.channel.rtcRegion, 'plugins/client/music#events.audioTracksAdd');

        await queue.metadata.channel.sendTyping();


        const embed = new EmbedBuilder()
            .setAuthor({ name: `${translations["title"]}`, iconURL: 'https://raw.githubusercontent.com/Youzi9601/YZBot/v13/Root/assets/music.gif' })
            .setDescription(`${translations["description"]} \n ‣ ${tracks.map(track => `[${track.title}](${track.url}) — ${track.author}`).join("\n")}`)
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
