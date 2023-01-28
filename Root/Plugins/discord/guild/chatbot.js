const db = require('quick.db');
const axios = require('axios');

module.exports =
    /**
     *
     * @param {import('discord.js').Message} message
     * @param {client} client
     * @param {*} container
     */
    (client) => {
        client.on('messageCreate', message => {
            if (!message.inGuild()) return;
            // 檢查是否發送
            var chat_bot = new db.table('chat_bot_system');
            const chatbot_data = chat_bot.get(`${message.guild.id}`) || { channelid: '000' };

            if (chatbot_data.channelid != message.channel.id) return;
            if (message.author.bot) return;

            // 輸入
            message.channel.sendTyping();
            if (!message.content) return message.reply('請說點什麼。');
            // 發送消息
            try {
                axios(
                    `https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${encodeURIComponent(client.user.username)}&ownername=${encodeURIComponent('Youzi9601 [程式碼作者]')}&user=${encodeURIComponent(message.author.username)}`)
                    .then((returnMsg) => {
                        if (!returnMsg || !returnMsg.data.message) return;
                        if (returnMsg.data.error)
                            return message.reply(':x: 出了一些差錯...請求的API方目前出現錯誤');
                        // if (`${returnMsg.data.message}`.includes('Try putting that in a more specific context.'))
                        // return message.reply(':x: 你在說什麼? 再說詳細一點！')
                        //  console.log(returnMsg)

                        message.reply(`${returnMsg.data.message}`);
                    });
            } catch (error) {
                message.reply(':x: 出了一些差錯...請求的API目前狀態為關閉');
            }


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
        });
    };