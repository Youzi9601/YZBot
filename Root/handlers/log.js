const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
/**
 * 日誌紀錄系統
 * @param {'Log'|'Info'|'Warn'|'Error'|'Debug'} type 輸出類別
 * @param {String & {
 * value: String,
 * client: import('discord.js').Client,
 * guildid: import('discord.js').Snowflake,
 * promise: Promises
 * }} input 輸入內容
 * @returns null
 */
module.exports = (type = 'Log', input = {
    client: require('./../bot'),
    guildid: undefined,
    promise: undefined,
}) => {

    // console
    const log_prefix = `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] [#${ require('./../bot').client.shard.ids }|${ type }]  `;

    if (typeof input == 'string') {
        console[type.toLowerCase()](log_prefix + (input.includes('\n') ? '\n' : '') + input);


    } else if (typeof input == 'object' && input.promise) {
        console[type.toLowerCase()](input.promise);
    }

    // to dev discord server of bot
    if (typeof input == 'object' && type.toLowerCase() == 'error') {
        if (!input.client)
            input.client = require('./../bot').client;
        const id = input?.client?.config?.guild?.Channels?.report;
        if (id) {

            const embed = new EmbedBuilder()
                .setTitle('❌ 發生了錯誤')
                .setDescription(`\`\`\`\n${ input.promise }\n${ input.promise?.stack ?? '未提供堆疊(位置)' }\`\`\``)
                .setColor(0xf24e43)
                .setFooter({
                    text: input.client.user.username,
                    iconURL: input.client.user.displayAvatarURL() || input.client.user.defaultAvatarURL,
                })
                .setTimestamp()
                .toJSON();

            return input.client.shard.broadcastEval(async (c, { channelId, content, embeds }) => {
                const channel = c.channels.cache.get(channelId);
                if (channel) {
                    await channel.send({
                        content: `${ content }`,
                        embeds: embeds,
                    });
                    return true;
                }
                return false;
            }, { context: { channelId: id, content: log_prefix, embeds: [embed] } });

        }
    }
};

