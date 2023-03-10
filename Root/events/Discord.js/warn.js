const { Events } = require('discord.js');
const config = require('../../../Config');
require("colors");

module.exports = {
    name: Events.Warn,
    once: false,
    disabled: config.console.warn || true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {*} _c
     */
    async execute(client, e) {
        client.console.warn(`[WARN] 發生了 Discord API 警告`.red);
        client.console.warn(e);
    },
};
