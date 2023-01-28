/**
 *
 * @param {*} promise
 * @param {*} reason
 * @param {import('discord.js').Client} client
 */
async function Missing_Permissions(promise = {}, reason = String, client) {
    /**
     *
     * ```js
     * // ERROR｜未處理的承諾拒絕：
     * Promise { // (reason)
     *      <rejected> DiscordAPIError: Missing Permissions
     *       at RequestHandler.execute (/home/container/node_modules/discord.js/src/rest/RequestHandler.js:350:13)
     *       at runMicrotasks (<anonymous>)
     *       at processTicksAndRejections (node:internal/process/task_queues:96:5)
     *       at async RequestHandler.push (/home/container/node_modules/discord.js/src/rest/RequestHandler.js:51:14)
     *       at async TextChannel.send (/home/container/node_modules/discord.js/src/structures/interfaces/TextBasedChannel.js:176:15) {
     *     method: 'post',
     *     path: '/channels/936193196545933355/messages',
     *     code: 50013,
     *     httpStatus: 403,
     *     requestData: { json: [Object], files: [] }
     *   }
     * }
     * DiscordAPIError: Missing Permissions //原因：(promise)
     * ```
     */
    if (`${reason.message}`.includes('Missing Permissions') || `${reason.message}`.includes('Missing Access')) {
        // 取得基本資料
        const { translate_Permissions } = require('../../Language/Language');

        const clientPermissions = require('./../../../bot').config.botPermissions;
        const channel_id = `${reason.path}`.match(/\d+/);
        const channel = client.channels.cache.get(`${channel_id[0]}`);
        if (!channel) return;
        const guild = client.guilds.cache.get(`${channel.guild.id}`);
        if (!guild) return;

        // guild.ownerId
        const missing = [];
        clientPermissions.forEach(i => {
            if (!guild.me.permissions.has(i))
                missing.push(translate_Permissions(i, 'zh-TW'));
        });

        let unsend = true;
        guild.channels.cache.filter(c => c.type == 'GUILD_TEXT' && c.nsfw == false && c.permissionsFor(client.user.id).has('SEND_MESSAGES')).forEach(c => {
            if (unsend) {
                unsend = false;
                c.send({
                    content: `<@${guild.ownerId}>, 我目前有部分缺少的權限，可能會讓機器人無法正常運作(於部分頻道)...\`\`\`\n• ${missing.join('\n• ')}\`\`\``,
                });
            }
        });

    }
}
exports.Missing_Permissions = Missing_Permissions;
