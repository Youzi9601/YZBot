const moment = require('moment');
const { Emoji } = require('discord.js');
const { log } = require('./../../../Utils/log');
module.exports = {
    name: 'emojiUpdate',
    once: false,
    /**
     *
     * @param {Emoji} oldEmoji 表情符號
     * @param {Emoji} newEmoji 表情符號
     */
    run: async (oldEmoji, newEmoji, client) => {
        // end
        log(
            'info',
            `表情符號 ${oldEmoji.name} -> ${newEmoji.name} 變更！`,
            true,
            client);
    },
};
