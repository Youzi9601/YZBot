const { messageCreate, Message, MessageActionRow, MessageButton } = require('discord.js');
const { config } = require('../../../bot');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Message} message
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (message, client, container) => {
        /*
         // cross-channel
         try {
             require('../../Plugins/discord/message/corss_server/cross_server')(message, client, container)
         } catch (error) {
             console.error(error)
         }
        */

        // 執行命令
        const loadCommandOptions = require('../../Structures/CommandOptions/loadCommandOptions');
        container.Config.prefix.forEach(prefix => {
            if (!message.content.toLowerCase().startsWith(prefix)) return;
            const cmdName = message.content.toString().toLowerCase().slice(prefix.length).trim().split(' ')[0];
            const command = client.commands.messageCommands.get(cmdName) ?? client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(cmdName));
            if (!command) return;
            if (command.allowBots) loadCommandOptions(client, message, command, false);
            else if (message.author.bot) return;
            else if (command.guildOnly == false) loadCommandOptions(client, message, command, false);
            else if (!message.guild) return;
            else loadCommandOptions(client, message, command, false);
        });

        // 其他工作

        // logging
        if (!message.guild) {
            if (message.author.bot) return;
            message.channel.sendTyping()
            const Buttons = new MessageButton()
                .setLabel('加入伺服器')
                .setStyle('LINK')
                .setURL(`https://discord.gg/${config.invite_code}`)
                .setDisabled(false);
            const row = new MessageActionRow()
                .addComponents(Buttons)
            message.channel.send({
                embeds: [
                    {
                        title: `機器人不支援私信、群組喔！`,
                        description: `${client.user.tag} 不支援於這裡使用任何服務喔！`
                    }
                ],
                components: [row]
            })
            const msg = {
                event: '訊息創建',
                content: '',
            };
            msg.content = [
                `成員：${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員 (??????)'}`,
                '位置：',
                `- 私信頻道`,
                `訊息(${message.id})：${message.content} ${message.attachments.map(a => a.url).join('\n')}${(message.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(message.embeds, null, 2) + '\n```' : ''}`,
            ].join('\n');

            log('guild-log',
                msg,
                true,
                client,
                undefined,
                undefined,
                undefined,
            );


        }
        else if (message.guild) {
            if (message.author.bot) return;
            const msg = {
                event: '訊息創建',
                content: '',
            };
            msg.content = [
                `成員：${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員 (??????)'}`,
                '位置：',
                `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
                `- 頻道 #${message.channel.name} (${message.channel.id})`,
                `訊息(${message.id})：${message.content} ${message.attachments.map(a => a.url).join('\n')}${(message.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(message.embeds, null, 2) + '\n```' : ''}`,
            ].join('\n');

            log('guild-log',
                msg,
                true,
                client,
                undefined,
                undefined,
                message.guild.id,
            );


            /*
                        const isBotLog = ((message.embeds[0] ? (message.embeds[0].description ? message.embeds[0].description : 'no description') : 'no embed')).includes('\n```') || false;
                        if (message.author.id == client.user.id && isBotLog) {
                            //
                        } else {
                            if (message.author.bot) return;
                            if (message.attachments.first() !== undefined) {
                                log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送了一個附件：${message.attachments.first().url}`, false);
                            }
                            if (message.content !== '') {
                                log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送消息：${message.content}`, false);
                            }
                            if (message.embeds.length !== 0) {
                                const a = message.embeds[0];
                                const embed = {};
                                for (const b in a) {
                                    if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
                                        embed[b] = a[b];
                                    }
                                }
                                log('info', `${message.author.tag} (${message.author.id}) 在 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) 中發送了一個嵌入： ${JSON.stringify(embed, null, 2)}`, false);
                            }
                        }
            */
        }


    },
};