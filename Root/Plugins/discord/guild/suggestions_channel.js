const db = require('quick.db');
const { log } = require('../../../Utils/log');

module.exports =
    /**
     *
     * @param {import('discord.js').Message} message
     * @param {client} client
     * @param {*} container
     */
    (client) => {
        client
            .on('messageCreate', message => {
                if (!message.inGuild()) return;
                // 檢查是否發送
                var suggestions_system = new db.table('suggestions_system');
                const suggestion_systems_data = suggestions_system.get(`${message.guild.id}`) || { channelid: '000' };

                if (suggestion_systems_data.channelid != message.channel.id) return;
                if (message.author.bot) return;

                // 輸入
                message.channel.sendTyping();
                const num = Math.round(Number(suggestion_systems_data.num) + 1) || 1;
                const embed = {
                    title: `#${num} 提議：`,
                    description: `${message.content}`,
                    color: 0xb21818,
                    footer: {
                        text: `${message.author.tag} 提出 ｜ ${client.user.username} 建議系統`,
                        icon_url: `${message.author.displayAvatarURL({ dynamic: true }) || message.author.defaultAvatarURL}`,
                    },
                };
                if (message.attachments.first() !== undefined) {

                    embed.image = {
                        url: `${message.attachments.first().url}`,
                    };

                }
                // 發送消息
                try {
                    message.delete();
                    message.channel.send({
                        embeds: [
                            embed,
                        ],
                    }).then((msg) => {
                        msg.react('✅').then(() => msg.react('❌'));
                        msg.startThread({
                            name: `提議 ${num} ｜ 討論串`,
                            autoArchiveDuration: 60,
                            reason: '可在此區討論！或許會有些新的想法可以在這裡作補充！',
                        }).then((thread) => {
                            thread.members.add(`${message.author.id}`);
                            log('info', `THREAD｜討論串新增 - ${thread.guild.name} (${thread.guild.id}) #${thread.parent.name} (${thread.parent.id}) : ${thread.name} (${thread.id})`, 'true', client);
                        });

                    });
                } catch (error) {
                    console.log(error);
                }
                suggestions_system.set(`${message.guild.id}`, { channelid: message.channel.id, num: num });

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