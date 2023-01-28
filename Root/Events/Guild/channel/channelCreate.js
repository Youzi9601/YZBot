const { GuildChannel } = require('discord.js');
const { log } = require('./../../../Utils/log');

module.exports = {
    name: 'channelCreate',
    once: false,
    /**
     *
     * @param {GuildChannel} channel 頻道
     */
    run: async (channel, client) => {
        const type = {
            'GUILD_TEXT': '文字頻道',
            'GUILD_VOICE': '語音頻道',
            'GUILD_CATEGORY': '類別頻道',
            'GUILD_NEWS': '公告頻道',
            'GUILD_STORE': '商城頻道',
            'GUILD_NEWS_THREAD': '討論串',
            'GUILD_PUBLIC_THREAD': '公共討論串',
            'GUILD_PRIVATE_THREAD': '私人跑討論串',
            'GUILD_STAGE_VOICE': '舞台頻道',
        };
        log(
            'info',
            `CHANNEL｜${channel.guild.name}(${channel.guild.id})${channel.parent ? '  -' + channel.parent.name + ` (${channel.parent.id}) ` : ''}: ${channel.name}(${channel.id}) ${type[channel.type]}已創建！`,
            true,
            client);
    },
};
