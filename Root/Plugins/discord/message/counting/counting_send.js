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
        if (message.author.bot) return;
        if (`${count_data.channel}` != `${message.channel.id}`) return;


        // 設定下一個正確的數字
        let num = `${Math.round(Number(count_data.num) + 1) || 1}`;
        let userid = message.author.id

        // 如果不是數字
        if (!(message.content.match(/\d/g))) {
            message.react('❌')
            message.reply({
                embeds: [
                    {
                        description: `:x: 這個不是數字喔！我們從\`${num - 1}\`繼續！uwu`
                    }
                ]
            });
            num = `${Math.round(num - 1)}`
        }
        // 如果連續數數，且設定為true
        else if (`${count_data.latestUserId}` == `${message.author.id}` && `${count_data.noTwice}` == 'true') {
            // 決定是否要重製
            // 輸入
            message.channel.sendTyping();
            if (`${count_data.WrongReset}` == 'true') {
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
                num = `0`
                userid = 0
            } else {
                message.react('❌')
                message.reply({
                    embeds: [
                        {
                            description: `:x:  不能重複數數喔！我們從\`${num - 1}\`繼續！`
                        }
                    ]
                })
                num = `${Math.round(num - 1)}`
            }

        } else // 如果數字是錯的
            if (!message.content.startsWith(`${num}`)) {
                // 輸入
                message.channel.sendTyping();
                // 如果要錯誤重製
                if (`${count_data.WrongReset}` == 'true') {
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
                    num = `${Math.round(0)}`
                    userid = 0
                }
                // 不錯誤重製
                else {

                    message.reply({
                        embeds: [
                            {
                                description: `:x: 錯了喔！下一個是\`${num}\`，我們從\`${num - 1}\`繼續！`
                            }
                        ]
                    })
                    num = `${Math.round(num - 1)}`
                }
                message.react('❌')
            } else // 如果沒事
                message.react('✅')


        const db_path_num = `data.discord.guilds.${message.guild.id}.channel.plugins.count_data.num`;
        db.set(db_path_num, num);
        const db_path_latestUser = `data.discord.guilds.${message.guild.id}.channel.plugins.count_data.latestUserId`;
        db.set(db_path_latestUser, userid);



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