const { Events } = require('discord.js');
const config = require('./../../../Config');
require("colors");

module.exports = {
    name: Events.Debug,
    once: false,
    disabled: config.console.debug || true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {*} _c
     */
    async execute(client, e) {
        client.console.debug(`[DEBUG] Discord API 檢查`.red);
        client.console.debug(e);
    },
};
