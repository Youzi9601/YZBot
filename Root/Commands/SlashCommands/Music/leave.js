const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'leave',
    description: '停止機器人並清除列隊',
    options: [
    ],
    default_permission: undefined,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],

    run: async (client, interaction, container) => {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) return await interaction.editReply('列隊中沒有歌曲');

        queue.destroy();
        await interaction.editReply('再見！');
    },
};
