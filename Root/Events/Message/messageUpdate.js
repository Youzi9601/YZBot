const { messageCreate, Message } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageUpdate',
    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (oldMessage, newMessage, client, container) => {

        if (!oldMessage.author) return;
        if (oldMessage.author.id == client.user.id) return;
        if (oldMessage.author.bot) return;
        log('info',
            `${oldMessage.author.tag} (${oldMessage.author.id}) 在 ${oldMessage.guild.name} (${oldMessage.guild.id}) ${oldMessage.channel.name} (${oldMessage.channel.id}) 編輯了訊息： ${oldMessage.content} -> ${newMessage.content}`,
            true,
            client,
        );
    },
};