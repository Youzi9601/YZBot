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
        // guilds
        if (oldGuild.afkChannel !== newGuild.afkChannel) {
            change.afkChannel = `${oldGuild.afkChannel || '無'
            } -> ${newGuild.afkChannel || '無'}`;
        }

        if (oldGuild.name !== newGuild.name) {
            change.name = `${oldGuild.name || '無'
            } -> ${newGuild.name || '無'}`;
        }

        if (oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel) {
            change.publicUpdatesChannel = `${oldGuild.publicUpdatesChannel || '無'
            } -> ${newGuild.publicUpdatesChannel || '無'}`;
        }

        if (oldGuild.rulesChannel !== newGuild.rulesChannel) {
            change.rulesChannel = `${oldGuild.rulesChannel || '無'
            } -> ${newGuild.rulesChannel || '無'}`;
        }

        if (oldGuild.systemChannel !== newGuild.systemChannel) {
            change.systemChannel = `${oldGuild.systemChannel || '無'
            } -> ${newGuild.systemChannel || '無'}`;
        }

        if (oldGuild.widgetChannel !== newGuild.widgetChannel) {
            change.widgetChannel = `${oldGuild.widgetChannel || '無'
            } -> ${newGuild.widgetChannel || '無'}`;
        }

        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            change.afkTimeout = `${oldGuild.afkTimeout || '無'
            } -> ${newGuild.afkTimeout || '無'}`;
        }

        // owner
        if (oldGuild.ownerId !== newGuild.ownerId) {
            change.ownerId = `${oldGuild.ownerId || '無'
            } -> ${newGuild.ownerId || '無'}`;
        }


        // console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        // console.info(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${oldGuild.name} (${oldGuild.type}) 已變更`);
        // end
        const msg =
            ''
            + `${change.name ? `\n伺服器名稱變更: ${change.name}` : ''}`
            + `${change.afkChannel ? `\n掛機頻道變更: ${change.nickname}` : ''}`
            + `${change.afkTimeout ? `\n掛機時間變更: ${change.afkTimeout}` : ''}`
            + `${change.rulesChannel ? `\n規則頻道變更: ${change.rulesChannel}` : ''}`
            + `${change.systemChannel ? `\n系統頻道變更: ${change.systemChannel}` : ''}`
            + `${change.widgetChannel ? `\n小工具頻道變更: ${change.widgetChannel}` : ''}`
            + `${change.publicUpdatesChannel ? `\n公共更新頻道變更: ${change.publicUpdatesChannel}` : ''}`
            + `${change.ownerId ? `\n伺服器所有者變更: ${change.ownerId}` : ''}`;


        log(
            'info',
            `CHANNEL｜${newGuild.name} 的設定變更：${msg}`,
            true,
            client);

        //
    },
};
