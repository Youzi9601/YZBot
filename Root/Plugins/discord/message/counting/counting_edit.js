const { config, client } = require('../../../../../bot');
const db = require('quick.db');
const { log } = require('../../../../Utils/log');

module.exports =
    /**
     *
     * @param {import('discord.js').Message} oldMessage
     * @param {import('discord.js').Message} newMessage
     * @param {client} client
     * @param {*} container
     */
    (oldMessage, newMessage, client, container) => {
        if (!newMessage.inGuild()) return;
        // 檢查是否發送
        const count_data = db.get(`data.discord.guilds.${newMessage.guild.id}.channel.plugins.count_data`) || 0;
        if (newMessage.author.bot) return;
        if (`${count_data.channel}` != `${newMessage.channel.id}`) return;

        const users_rections = oldMessage.reactions
            .resolve('⚠') || 'none';
        const isMe = users_rections.me || 'none'
        let users_ = []
        let botiswarning = false
        /*if (`${users_}`.includes(`${client.user.id}`)) {
            botiswarning = true
        }*/
        if (`${isMe}` == 'true') {
            botiswarning = true
        }

        if (oldMessage.content.match(/\d/g) && !botiswarning) {
            newMessage.reply({
                embeds: [
                    {
                        description: `:warning: 注意：這個訊息的數字為\`${oldMessage.content.match(/\d/g)[0]}\``
                    }
                ]
            });
            newMessage.react('⚠')
        }
    };