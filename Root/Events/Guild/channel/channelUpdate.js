const { GuildChannel, TextChannel, VoiceChannel } = require('discord.js');
const { log } = require('./../../../Utils/log');

module.exports = {
    name: 'channelUpdate',
    once: false,
    /**
       * @event this
       * @description 當頻道更新時
       * @param {import('discord.js').Client} client 機器人
       * @param {VoiceChannel} oldChannel
       * @param {GuildChannel} newChannel
       */
    run: async (oldChannel, newChannel, client) => {

        const change = {};
        // 名稱
        if (oldChannel.name !== newChannel.name) {
            change.name = `${oldChannel.name} -> ${newChannel.name}`;
        }
        // 類別
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
        if (oldChannel.type !== newChannel.type) {
            change.type = `${type[oldChannel.type]} -> ${type[newChannel.type]}`;
        }
        // 類別
        if (oldChannel.parent !== newChannel.parent) {
            change.parent = `${oldChannel.parent ? oldChannel.parent.name : '無'} -> ${newChannel.parent ? newChannel.parent.name : '無'}`;
        }
        // 順位
        if (oldChannel.position !== newChannel.position) {
            change.position = `${oldChannel.position} -> ${newChannel.position}`;
        }
        // 主題
        if (oldChannel.topic !== newChannel.topic) {
            change.topic = `\n${oldChannel.topic ? `${(oldChannel.topic.length > 50) ? oldChannel.topic.substring(0, 50) + ' (省略)……' : oldChannel.topic}` : '無'} \n-> \n${newChannel.topic ? `${(newChannel.topic.length > 50) ? newChannel.topic.substring(0, 50) + ' (省略)……' : newChannel.topic}` : '無'}`;
        }
        // 權限
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
            change.permissionOverwrites = `${oldChannel.permissionOverwrites} -> ${newChannel.permissionOverwrites}`;
        }
        // 顯示
        if (oldChannel.viewable !== newChannel.viewable) {
            change.viewable = `${oldChannel.viewable} -> ${newChannel.viewable}`;
        }
        // NSFW
        if (oldChannel.nsfw !== oldChannel.nsfw) {
            change.nsfw = `${oldChannel.nsfw} -> ${newChannel.nsfw}`;
        }
        // rate
        if (oldChannel.rateLimitPerUser !== oldChannel.rateLimitPerUser) {
            change.rateLimitPerUser = `${oldChannel.rateLimitPerUser} -> ${newChannel.rateLimitPerUser}`;
        }
        // userLimit
        if (oldChannel.userLimit !== oldChannel.userLimit) {
            change.userLimit = `${oldChannel.userLimit} -> ${newChannel.userLimit}`;
        }
        // console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        // console.info(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${oldChannel.name} (${oldChannel.type}) 已變更`);
        // end
        const msg =
            ''
            + `${change.name ? `\n名稱變更: ${change.name}` : ''}`
            + `${change.type ? `\n種類變更: ${change.type}` : ''}`
            + `${change.parent ? `\n類別變更: ${change.parent}` : ''}`
            + `${change.position ? `\n順位變更: ${change.position}` : ''}`
            // + `${change.permissionOverwrites ? `\n權限變更: ${change.permissionOverwrites}` : ''}`
            + `${change.topic ? `\n主題變更: ${change.topic}` : ''}`
            + `${change.viewable ? `\n可見變更: ${change.viewable}` : ''}`
            + `${change.nsfw ? `\nNSFW變更: ${change.nsfw}` : ''}`
            + `${change.rateLimitPerUser ? `\n速率變更: ${change.rateLimitPerUser}` : ''}`
            + `${change.userLimit ? `\n最大人數變更: ${change.userLimit}` : ''}`
            + `${change.permissionOverwrites ? '\n權限變更: 請看"審核日誌"' : ''}`;
        log(
            'info',
            `CHANNEL｜${newChannel.guild.name} (${newChannel.guild.id}) - ${newChannel.parent ? '  -' + newChannel.parent.name + ` (${newChannel.parent.id}) ` : ''} : ${newChannel.name} (${newChannel.id},${type[newChannel.type]}) 的頻道類別變更：${msg} `,
            true,
            client);

        //
    },
};
