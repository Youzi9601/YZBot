const { Events } = require('discord.js')
require("colors");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client, _c) {
        console.log(`[#${ client.shard.ids }]  ` + `[準備] ${ client.user.tag } 完成登入！`.brightGreen);
        require('./bot/status')(client)
    },
};
