const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const { TextChannel } = require('discord.js');
const { log } = require('./../../../Utils/log');
module.exports = {
    name: 'channelPinsUpdate',
    once: false,
    /**
     *
     * @param {TextChannel} channel 頻道
     * @param {Pin} time 釘選時間
     */
    run: async (channel, time, client) => {
        log(
            'info',
            `${channel.tag} 於${time}更新了釘選訊息`,
            true,
            client);
    },
};
