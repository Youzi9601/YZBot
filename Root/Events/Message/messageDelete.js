const { messageCreate, Message } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageDelete',
    /**
     *
     * @param {Message} message
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (message, client, container) => {
        // counting
        require('../../Plugins/discord/message/counting/counting_delete')(message, client, container);

        log('info',
            `${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員'}  於 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 的訊息被刪除：${message.content}`,
            true,
            client,
        );
    },
};