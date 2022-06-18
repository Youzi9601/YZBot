const { messageCreate, Message } = require('discord.js');
const { log } = require('../../Utils/log');

module.exports = {
    name: 'messageDelete',
    /**
     *
     * @param {Message} message
     * @param {import('discord.js').Client} client 機器人
     * @param {*} container
     */
    run: async (message, client, container) => {


        // Ignore direct messages
        if (!message.guild) return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const deletionLog = fetchedLogs.entries.first();
        const msg = {
            event: '訊息刪除',
            content: '',
        };
        // Perform a coherence check to make sure that there's *something*
        if (!deletionLog) {
            msg.content = [
                `成員：${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員 (??????)'}`,
                '位置：',
                `伺服器 - ${message.guild.name} (${message.guild.id}) `,
                `頻道 - #${message.channel.name} (${message.channel.id})`,
                `訊息內容：${message.content} ${message.attachments.map(a => a.url).join('\n')}${(message.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(message.embeds, null, 2) + '\n```' : ''}`,
            ].join('\n');
        } else {
            // 現在獲取刪除消息的人的用戶對象
            // 同時抓取這個動作的目標來仔細檢查
            const { executor, target } = deletionLog;

            // 用更多信息更新輸出
            // 同時運行檢查以確保返回的日誌是針對同一作者的消息
            if (target.id != executor.id) {
                msg.content = [
                    `成員：${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員 (??????)'}`,
                    `刪除者：${executor.tag} (${executor.id})`,
                    '位置：',
                    `伺服器 - ${message.guild.name} (${message.guild.id}) `,
                    `頻道 - #${message.channel.name} (${message.channel.id})`,
                    `訊息內容：${message.content} ${message.attachments.map(a => a.url).join('\n')}${(message.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(message.embeds, null, 2) + '\n```' : ''}`,
                ].join('\n');
            } else {
                msg.content = [
                    `成員：${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員 (??????)'}`,
                    '位置：',
                    `- 伺服器 ${message.guild.name} (${message.guild.id}) `,
                    `- 頻道 #${message.channel.name} (${message.channel.id})`,
                    `訊息(${message.id})：${message.content} ${message.attachments.map(a => a.url).join('\n')}${(message.embeds.length !== 0) ? '\n```json\n' + JSON.stringify(message.embeds, null, 2) + '\n```' : ''}`,
                ].join('\n');
            }
        }
        log('guild-log',
            msg,
            true,
            client,
            undefined,
            undefined,
            message.guild.id,
        );
    },
};