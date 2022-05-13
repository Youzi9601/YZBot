const { Guild } = require('discord.js');
const { log } = require('./../../Utils/log');

module.exports = {
    name: 'guildUpdate',
    once: false,
    /**
       * @event this
       * @description 當頻道更新時
       * @param {import('discord.js').Client} client 機器人
       * @param {Guild} oldGuild
       * @param {Guild} newGuild
       */
    run: async (oldGuild, newGuild, client) => {
        if (newGuild == undefined) return log('info', '伺服器刪除！');
        const change = {};
        // channels
        if (oldGuild.afkChannel !== newGuild.afkChannel) {
            change.afkChannel = `${oldGuild.afkChannel} -> ${newGuild.afkChannel}`;
        }

        if (oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel) {
            change.publicUpdatesChannel = `${oldGuild.publicUpdatesChannel} -> ${newGuild.publicUpdatesChannel}`;
        }

        if (oldGuild.rulesChannel !== newGuild.rulesChannel) {
            change.rulesChannel = `${oldGuild.rulesChannel} -> ${newGuild.rulesChannel}`;
        }

        if (oldGuild.systemChannel !== newGuild.systemChannel) {
            change.systemChannel = `${oldGuild.systemChannel} -> ${newGuild.systemChannel}`;
        }

        if (oldGuild.widgetChannel !== newGuild.widgetChannel) {
            change.widgetChannel = `${oldGuild.widgetChannel} -> ${newGuild.widgetChannel}`;
        }

        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            change.afkTimeout = `${oldGuild.afkTimeout} -> ${newGuild.afkTimeout}`;
        }

        // owner
        if (oldGuild.ownerId !== newGuild.ownerId) {
            change.ownerId = `${oldGuild.ownerId} -> ${newGuild.ownerId}`;
        }


        // console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        // console.info(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${oldGuild.name} (${oldGuild.type}) 已變更`);
        // end
        const msg =
            ''
            + `${change.afkChannel ? `\n掛機頻道變更: ${change.nickname}` : ''}`
            + `${change.afkTimeout ? `\n掛機時間變更: ${change.afkTimeout}` : ''}`
            + `${change.rulesChannel ? `\n規則頻道變更: ${change.rulesChannel}` : ''}`
            + `${change.systemChannel ? `\n系統頻道變更: ${change.systemChannel}` : ''}`
            + `${change.widgetChannel ? `\n小工具頻道變更: ${change.widgetChannel}` : ''}`
            + `${change.publicUpdatesChannel ? `\n公共更新頻道變更: ${change.publicUpdatesChannel}` : ''}`
            + `${change.ownerId ? `\n伺服器所有者變更: ${change.ownerId}` : ''}`;


        log(
            'info',
            `CHANNEL｜${newGuild.guild.name} - ${newGuild.user.tag} (${newGuild.id}) 的頻道類別變更：${msg}`,
            true,
            client);

        //
    },
};
