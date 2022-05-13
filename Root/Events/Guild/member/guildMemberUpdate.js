const { GuildMember } = require('discord.js');
const { log } = require('../../../Utils/log');

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    /**
       * @event this
       * @description 當頻道更新時
       * @param {import('discord.js').Client} client 機器人
       * @param {GuildMember} oldMember
       * @param {GuildMember} newMember
       */
    run: async (oldMember, newMember, client) => {

        const change = {};
        // 使用者名稱
        if (oldMember.user.name !== newMember.user.name) {
            change.name = `${oldMember.user.name} -> ${newMember.user.name}`;
        }
        // 使用者頭像
        if (`${oldMember.user.avatarURL({ dynamic: true }) || oldMember.user.defaultAvatarURL}` != `${newMember.user.avatarURL({ dynamic: true }) || newMember.user.defaultAvatarURL}`) {
            change.avatar = `${oldMember.user.avatarURL({ dynamic: true }) || oldMember.user.defaultAvatarURL} -> ${newMember.user.avatarURL({ dynamic: true }) || newMember.user.defaultAvatarURL}`;
        }

        // 暱稱
        if (oldMember.nickname !== newMember.nickname) {
            change.nickname = `${oldMember.nickname} -> ${newMember.nickname}`;
        }
        // 順位
        if (oldMember.roles !== newMember.roles) {
            change.roles = '無法顯示 :/';
        }
        console.assert(oldMember.roles);
        // console.info(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`) + chalk.bgYellow.bold('客戶端嘗試重新連接到 WebSocket'));
        // console.info(`\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${oldMember.name} (${oldMember.type}) 已變更`);
        // end
        const msg =
            ''
            + `${change.nickname ? `\n名稱變更: ${change.nickname}` : ''}`
            + `${change.roles ? `\n身分組變更: ${change.roles}` : ''}`
            + `${change.avatar ? `\n頭像變更: ${change.avatar}` : ''}`
            + `${change.name ? `\n名稱變更: ${change.name}` : ''}`;

        log(
            'info',
            `CHANNEL｜${newMember.guild.name} - ${newMember.user.tag} (${newMember.id}) 的頻道類別變更：${msg}`,
            true,
            client);

        //
    },
};
