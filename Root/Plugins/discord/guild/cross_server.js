const { config, client } = require('../../../../bot');
const db = require('quick.db');
const { log } = require('../../../Utils/log');

module.exports =
    /**
     *
     * @param {import('discord.js').Client} client
     */
    (client) => {
        client.on('messageCreate', message => {
            // 取得該資料
            var cross_server_system = new db.table('cross_server_system');
            // 查詢該頻道是否為webhook
            /**@param {Array} this_guild */
            const this_guild = cross_server_system.get(message.guild.id)
            /*
            [
                {
                    channelID: '100000',
                    id: 'a'
                },
                {
                    channelID: '120000',
                    id: 'b'
                },
            ]
            */
            // 取得ID
            const chat_id = this_guild.forEach(data => {
                if (data.channelID == message.channel.id) {
                    return data.id
                }
            })
            // 沒有ID，返回
            if (!chat_id) return;
            // 查找有此ID的頻道，並傳回ID
            const channels_id = this_guild.filter(c => { c.id == chat_id }).map(c => c.channelID)
            // 針對這些ID進行查詢，並傳送webhook
            channels_id.forEach(c_id => {
                const channel = client.channels.cache.get(c_id)
                // 嘗試
                try {
                    // 找到可使用之webhook
                    const webhooks = await channel.fetchWebhooks();
                    let webhook = webhooks.find(wh => wh.token);
                    // 沒有webhook，創建一個
                    if (!webhook) {
                        webhook = await interaction.channel.createWebhook(
                            client.user.username + ' - Webhook系統',
                            {
                                avatar:
                                    client.user.displayAvatarURL()
                                    || client.user.defaultAvatarURL,
                            },
                        );
                    }
                    // 發送消息
                    await webhook.send({
                        username: `${message.member.nickname ? `${message.member.nickname} (${message.author.tag})` : message.author.tag} 來自 ${message.guild.name}`,
                        avatarURL: message.author.displayAvatarURL({ dynamic: true }) || message.author.defaultAvatarURL,
                        content: message.content,
                        embeds: message.embeds,
                    });

                } catch (error) {
                    console.error(error)
                    return await message.reply(`:x: 發生了錯誤：\`\`\`js\n${error}\`\`\``);
                }

            })

        })
        // 取得該頻道的跨群代碼
        // .${message.guild.id}

        /*var servers_data = [
            {
                channelid: 000000,
                id: 'abc',
            },
        ];*/

    };