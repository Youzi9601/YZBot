const { TextChannel } = require('discord.js');
const { log } = require('../../../../Utils/log');
module.exports = {
    name: 'channelPinsUpdate',
    once: false,
    /**
     *
     * @param {TextChannel} channel 頻道
     * @param {timestamp} time 釘選時間
     */
    run: async (channel, time, client) => {
        log(
            'info',
            `CHANNEL｜${channel.guild.name} - ${channel.name}(${channel.id}) 於${time}更新了釘選訊息`,
            true,
            client);
    },
};
