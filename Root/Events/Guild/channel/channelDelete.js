const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const { Channel } = require('discord.js');
const { log } = require('./../../../Utils/log')
module.exports = {
    name: 'channelDelete',
    once: false,
    /**
     *
     * @param {Channel} channel 頻道
     */
    run: async (channel, client) => {
        log(
            'info',
            `${channel.tag} (${channel.id}) 已刪除！`,
            true,
            client)
    },
};
