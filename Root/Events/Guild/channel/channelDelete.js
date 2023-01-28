const { GuildChannel } = require('discord.js');
const { log } = require('./../../../Utils/log');
module.exports = {
    name: 'channelDelete',
    once: false,
    /**
     *
     * @param {GuildChannel} channel 頻道
     */
    run: async (channel, client) => {
        log(
            'info',
            `CHANNEL｜${channel.guild.name}(${channel.guild.id})${channel.parent ? '  -' + channel.parent.name + ` (${channel.parent.id}) ` : ''} : ${channel.name} (${channel.id}) 已刪除！`,
            true,
            client);
    },
};
