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
        require('../../Plugins/discord/message/counting/counting_edit')(oldMessage, newMessage, client, container);

        if (newMessage.author.id == client.user.id) return;
        if (newMessage.author.bot) return;
        log('info',
            `${newMessage.author.tag} (${newMessage.author.id}) 在 ${newMessage.guild.name} (${newMessage.guild.id}) ${newMessage.channel.name} (${newMessage.channel.id}) 編輯了訊息： ${oldMessage.content} -> ${newMessage.content}`,
            true,
            client,
        );
    },
};