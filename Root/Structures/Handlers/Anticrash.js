/**
 *
 * @param {import('./../../../bot').client} client
 */
const config = require('./../../../Config')
module.exports = (client) => {
    // #region 事件
    // 處理錯誤
    process
        .on('unhandledRejection', (reason, promise) => {
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );
                const msg = {};
                const embed = {};
                msg.content = `新的**錯誤**出現！ <@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg).then(msg => {
                    if (error_channel.type == 'GUILD_NEWS') msg.crosspost();
                });
            } catch (error) {
                // none
            }

        })
        .on('uncaughtException', (reason, promise) => {
            console.error('ERROR｜未處理的承諾拒絕：\n', ' ', promise, '\n原因：', reason + '\n');
            try {
                // console 頻道
                const error_channel = client.channels.cache.get(
                    config.Channels.report,
                );

                const msg = {};
                const embed = {};
                msg.content = `新的**錯誤**出現！ <@${config.developers[0]}>`;
                embed.title = `ERROR｜錯誤 - ${reason.message}`;
                embed.description = `\`\`\`js\n${reason ? `\n${reason.stack}${reason.request ? `\n${reason.request}` : ''}` : ''}\n\`\`\``;
                embed.color = '0x' + 'FF0000';
                embed.timestamp = new Date();
                msg.embeds = [embed];
                error_channel.send(msg).then(msg => {
                    if (error_channel.type == 'GUILD_NEWS') msg.crosspost();
                });
            } catch (error) {
                // none
            }
        });
    // #endregion

};
