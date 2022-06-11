const { messageCreate, Message } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageUpdate',
    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (oldMessage, newMessage, client, container) => {

        if (!oldMessage.guild || !oldMessage.author || oldMessage.author.bot) return;
        const msg = {
            event: '訊息編輯',
            content: [
                `成員：${oldMessage.author ? oldMessage.author.tag + ` (${oldMessage.author.id})` : '無法取得使成員 (??????)'}`,
                '位置',
                `- 伺服器： ${oldMessage.guild.name} (${oldMessage.guild.id}) `,
                `- 頻道： #${oldMessage.channel.name} (${oldMessage.channel.id})`,
                `訊息(${oldMessage.id})`,
                `- 舊：${oldMessage.content} ${oldMessage.attachments.map(a => a.url).join('\n')}${(oldMessage.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(oldMessage.embeds, null, 2) + '\n```' : ''}`,
                `- 新：${newMessage.content} ${newMessage.attachments.map(a => a.url).join('\n')}${(newMessage.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(newMessage.embeds, null, 2) + '\n```' : ''}`,
            ].join('\n'),
        };

        log('guild-log',
            msg,
            true,
            client,
            undefined,
            undefined,
            oldMessage.guild.id,
        );
    },
};