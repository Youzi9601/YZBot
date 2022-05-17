const { config, client } = require('../../../../../bot');
const db = require('quick.db');
const { log } = require('../../../../Utils/log');

module.exports =
    /**
     *
     * @param {import('discord.js').Message} message
     * @param {client} client
     * @param {*} container
     */
    (message, client, container) => {
        if (!message.inGuild()) return;
        // 檢查是否發送
        const count_data = db.get(`data.discord.guilds.${message.guild.id}.channel.plugins.count_data`) || 0;
        if (`${message.author.bot ? 'true' : 'false'}` == 'true') return;
        if (`${count_data.channel}` != `${message.channel.id}`) return;

        const users_rections = message.reactions
            .resolve('⚠') || 'none';
        const isMe = users_rections.me || 'none';
        let botiswarning = false;
        /* if (`${users_}`.includes(`${client.user.id}`)) {
            botiswarning = true
        }*/
        if (`${isMe}` == 'true') {
            botiswarning = true;
        }

        if (message.content.match(/\d/g)[0] && !botiswarning)
            message.channel.send({
                embeds: [
                    {
                        description: `:warning: 注意：有個被刪除的訊息之數字為\`${message.content.match(/\d/g)[0]}\`...就看你相不相信了。`,
                    },
                ],
            });

        //

        /*
        fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${client.user.username}&ownername=${config.developers[0]}`)
             .then(res => res.json())
             .then(data => {
                 console.debug(data)
                 message.reply(`${data.message}`)
                 message.channel.send(`> ${message.content} \n <@${message.author.id}> ${data.message} `);
             });
        */
    };