const moment = require('moment');
module.exports =
    /**
     * 日誌紀錄系統
     * @param {'Log'|'Info'|'Warn'|'Error'|'Debug'} type 輸出類別
     * @param {String} input 輸入內容
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Snowflake} _guildid 伺服器ID
     * @param {any} promise 處理回傳內容(另外輸出)
     */
    (
        type = 'Log',
        input = undefined,
        client = require('./../bot'),
        _guildid = undefined,
        promise = undefined,
    ) => {

        const log_prefix = `[${ moment().format('YYYY-MM-DD HH:mm:ss') }] [#${ client.shard.ids }|${ type }]  `;
        if (!promise) {
            console[type.toLowerCase()](log_prefix + (input.includes('\n') ? '\n' : '') + input);
        } else {
            console[type.toLowerCase()](promise);
        }

    };

