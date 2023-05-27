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

    const log_prefix = `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] [#${ require('./../bot').client.shard.ids }|${ type }]  `;

    if (typeof input == 'string') {
        console[type.toLowerCase()](log_prefix + (input.includes('\n') ? '\n' : '') + input);


    } else if (typeof input == 'object' && input.promise) {
        console[type.toLowerCase()](input.promise);
    }

};

