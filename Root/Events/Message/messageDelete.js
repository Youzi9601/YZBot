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
        let msg = '';
        // Perform a coherence check to make sure that there's *something*
        if (!deletionLog) {
            msg = ' 的一條消息已被刪除，但未找到相關審核日誌。';
        } else {
            // 現在獲取刪除消息的人的用戶對象
            // 同時抓取這個動作的目標來仔細檢查
            const { executor, target } = deletionLog;

            // 用更多信息更新輸出
            // 同時運行檢查以確保返回的日誌是針對同一作者的消息
            if (target.id === message.author.id) {
                msg = ` 的消息被 ${executor.tag} (${executor.id}) 刪除了。`;
            } else {
                msg = ' 的一條消息已被刪除，但我們不知道是誰刪除的。';
            }
        }
        log('info',
            `${message.author ? message.author.tag + `(${message.author.id})` : '無法取得使成員'} ${msg}  \n>>> 於 ${message.guild.name} (${message.guild.id}) ${message.channel.name} (${message.channel.id}) \n>>> 訊息：${message.content} ${message.attachments.map(a => a.url).join('\n')} ${message.embeds.toString}`,
            true,
            client,
        );
    },
};