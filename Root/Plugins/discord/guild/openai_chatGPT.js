const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('./../../../../Config')

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
            call(message)
        });
    };

async function call(message) {
    var openai_chatgpt = db.table('openai_chatGPT');
    const chatbot_data = await openai_chatgpt.get(`${ message.guild.id }`) || { channelid: '000' };

    //console.log(chatbot_data.channelid, " & ", message.channel.id)

    if (chatbot_data.channelid != message.channel.id) return;
    if (message.author.bot) return;

    // 輸入
    message.channel.sendTyping();
    if (!message.content) return message.reply('請說點一些話或是問題。');
    try {
        // To use ESM in CommonJS, you can use a dynamic import
        const { ChatGPTAPI, getOpenAIAuth } = await import('chatgpt')
        console.log("取得ChatGPT")
        const openAIAuth = await getOpenAIAuth(config.plugins.chatgpt)
        console.log("取得OPEN AI Auth")
        const api = new ChatGPTAPI({ ...openAIAuth })
        await api.initSession()
        console.log("通過認證")
        // send a message and wait for the response
        let res = await api.sendMessage(message.content)
        console.log("成功取得訊息回答")
        //回傳
        console.log(res.response)
        message.reply(`${ res.response }`);
    } catch (error) {
        message.reply(':x: 出了一些差錯...請求的API目前狀態為關閉');
        console.log(error)
    }

}