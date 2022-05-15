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

        if (count_data.channel != message.channel.id) return;
        if (message.author.bot) return;

        // 輸入
        message.channel.sendTyping();
        // 設定下一個正確的數字
        const num = Math.round(Number(count_data.num) + 1) || 1;

        // 如果連續數數，且設定為true
        if (count_data.latestUserId == message.author.id && count_data.noTwice == 'true') {
            // 決定是否要重製
            if (count_data.WrongReset) {
                message.react('❌')
                message.reply({
                    embeds: [
                        {
                            description: `:x: 不能重複數數喔！我們從\`0\`開始！`
                        }
                    ]
                }).then((message) => {
                    message.channel.send('0').then((msg) => {
                        msg.react('✅')
                    })
                })
                num = 0
            } else {
                message.react('❌')
                message.reply({
                    embeds: [
                        {
                            description: `:x:  不能重複數數喔！我們從\`${num - 1}\`開始！`
                        }
                    ]
                })
                num = num - 1
            }

        } else // 如果數字是錯的
            if (message.content != num) {
                // 如果要錯誤重製
                if (count_data.WrongReset) {
                    message.reply({
                        embeds: [
                            {
                                description: `:x: 錯了喔！下一個是\`${num}\`，我們從\`0\`開始！`
                            }
                        ]
                    }).then((message) => {
                        message.channel.send('0').then((msg) => {
                            msg.react('✅')
                        })
                    })
                    num = 0
                }
                // 不錯誤重製
                else {

                    message.reply({
                        embeds: [
                            {
                                description: `:x: 錯了喔！下一個是\`${num}\`，我們從\`${num - 1}\`開始！`
                            }
                        ]
                    })
                    num = num - 1
                }
                message.react('❌')
            } else // 如果沒事
                message.react('✅')

        // 發送消息
        try {
        } catch (error) {
            console.log(error);
        }
        const db_data = `data.discord.guilds.${message.guild.id}.channel.plugins.count_data.num`;
        db.set(db_data, num);


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