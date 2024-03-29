const { Events } = require('discord.js');
const config = require('./../../../Config');
require("colors");

module.exports = {
    name: Events.Error,
    once: false,
    disabled: config.console.error || true,
    /**
     *
     * @param {import('./../../bot').client} client
     * @param {*} _c
     */
    async execute(client, e) {
        client.console('Error', `[ERROR] 發生了 Discord API 錯誤`.red);
        client.console('Error', { promise: e });
    },
};
