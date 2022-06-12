const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Formatters,
} = require('discord.js');
const { log } = require('./../../Utils/log');
module.exports = {
    name: 'report_message',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const reportmsg = interaction.fields.getTextInputValue('reportmsg');
        const reason = interaction.fields.getTextInputValue('reason') || '無';
        const whatelse = interaction.fields.getTextInputValue('whatelse') || '無';
        interaction.reply({ content: '你的舉報已收到！' + Formatters.codeBlock('markdown', '為何檢舉?\n' + reason + '\n其他說明\n' + whatelse), ephemeral: true });
        log('REPORT', `有新的舉報！\n ${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 舉報訊息：${reportmsg}\n${'為何檢舉?\n' + reason + '\n其他說明\n' + whatelse}`, true, client);

    },
};