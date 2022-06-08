const db = require('quick.db');

module.exports =
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {*} container
     */
    (client) => {
        client.on('messageCreate', message => {
            if (!message.inGuild()) return;
            // 檢查是否發送
            var countting_system = new db.table('countting_system');
            const count_data = countting_system.get(`${message.guild.id}`) || { channelid: '000' };

            if (message.author.bot) return;
            if (`${count_data.channelid}` != `${message.channel.id}`) return;

            // 設定下一個正確的數字
            let num = `${Math.round(Number(count_data.num) + 1) || 1}`;
            let userid = message.author.id;

            // 如果不是數字
            if (!(message.content.match(/\d/g))) {
                message.react('❌');
                message.reply({
                    embeds: [
                        {
                            description: `:x: 這個不是數字喔！我們從\`${num - 1} (目前)\`繼續！uwu`,
                        },
                    ],
                });
                num = `${Math.round(num - 1)}`;
                userid = count_data.latestUserId;
            }
            // 如果連續數數，且設定為true
            else if (`${count_data.latestUserId}` == `${message.author.id}` && `${count_data.noTwice}` == 'true') {
                // 決定是否要重製
                // 輸入
                message.channel.sendTyping();
                if (`${count_data.WrongReset}` == 'true') {
                    message.react('❌');
                    message.reply({
                        embeds: [
                            {
                                description: ':x: 不能重複數數喔！我們從`0`開始！',
                            },
                        ],
                    }).then((message) => {
                        message.channel.send('0').then((msg) => {
                            msg.react('✅');
                        });
                    });
                    num = '0';
                    userid = 0;
                } else {
                    message.react('❌');
                    message.reply({
                        embeds: [
                            {
                                description: `:x:  不能重複數數喔！我們從\`${num - 1} (目前)\`繼續！`,
                            },
                        ],
                    });
                    num = `${Math.round(num - 1)}`;
                    userid = count_data.latestUserId;
                }

            } else // 如果數字是錯的
            if (message.content.match(/\d+/g)[0] != num) {
                // 輸入
                message.channel.sendTyping();
                // 如果要錯誤重製
                if (`${count_data.WrongReset}` == 'true') {
                    message.reply({
                        embeds: [
                            {
                                description: `:x: 錯了喔！下一個是\`${num}\`，我們從\`0\`開始！`,
                            },
                        ],
                    }).then((message) => {
                        message.channel.send('0').then((msg) => {
                            msg.react('✅');
                        });
                    });
                    num = `${Math.round(0)}`;
                    userid = 0;
                }
                // 不錯誤重製
                else {

                    message.reply({
                        embeds: [
                            {
                                description: `:x: 錯了喔！下一個是\`${num}\`，我們從\`${num - 1}\`繼續！`,
                            },
                        ],
                    });
                    num = `${Math.round(num - 1)}`;
                    userid = count_data.latestUserId;
                }
                message.react('❌');
            } else // 如果沒事
                message.react('✅');

            //  設定
            countting_system.set(`${message.guild.id}`, {
                channelid: count_data.channelid,
                WrongReset: count_data.WrongReset,
                noTwice: count_data.noTwice,
                latestUserId: userid,
                num: num,
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
        })
            .on('messageUpdate', (oldMessage, newMessage) => {

                if (!newMessage.inGuild()) return;
                // 檢查是否發送
                var countting_system = new db.table('countting_system');
                const count_data = countting_system.get(`${newMessage.guild.id}`) || { channelid: '000' };

                if (!oldMessage.author) return;
                if (oldMessage.author.bot) return;
                if (`${count_data.channelid}` != `${newMessage.channel.id}`) return;

                const users_rections = oldMessage.reactions
                    .resolve('⚠') || 'none';
                const isMe = users_rections.me || 'none';
                let botiswarning = false;
                /* if (`${users_}`.includes(`${client.user.id}`)) {
                    botiswarning = true
                }*/
                if (`${isMe}` == 'true') {
                    botiswarning = true;
                }

                if (oldMessage.content.match(/\d/g) && !botiswarning) {
                    newMessage.reply({
                        embeds: [
                            {
                                description: `:warning: 注意：這個訊息的數字為\`${oldMessage.content.match(/\d+/g)[0]}\``,
                            },
                        ],
                    });
                    newMessage.react('⚠');
                }
            })
            .on('messageDelete', message => {

                if (!message.inGuild() || message.author == null) return;
                // 檢查是否發送
                var countting_system = new db.table('countting_system');
                const count_data = countting_system.get(`${message.guild.id}`) || { channelid: '000' };

                if (`${message.author.bot ? 'true' : 'false'}` == 'true') return;
                if (`${count_data.channelid}` != `${message.channel.id}`) return;

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

                if (message.content.match(/\d/g) && !botiswarning)
                    message.channel.send({
                        embeds: [
                            {
                                description: `:warning: 注意：有個被刪除的訊息之數字為\`${message.content.match(/\d+/g)[0]}\`...就看你相不相信了。`,
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
            });
    };