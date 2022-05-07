const moment = require('moment');
const { Emoji } = require('discord.js');
const { log } = require('./../../../Utils/log')
module.exports = {
    name: 'emojiDelete',
    once: false,
    /**
     *
     * @param {Emoji} emoji 表情符號
     */
    run: async (emoji, client) => {
        // end
        log(
            'info',
            `表情符號 ${emoji.name} (${emoji.url}) 已刪除！`,
            true,
            client)
    },
};
