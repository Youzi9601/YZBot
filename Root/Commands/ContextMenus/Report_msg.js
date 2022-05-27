const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
module.exports = {
    name: '舉報訊息',
    type: 'MESSAGE',
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').MessageContextMenuInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {

        // 創建模態
        const modal = new Modal()
            .setCustomId('report_message')
            .setTitle('舉報訊息');
        // 將組件添加到模態
        const reportmsg = new TextInputComponent()
            .setCustomId('reportmsg')
            .setPlaceholder('網址')
            .setStyle('PARAGRAPH')
            .setLabel('舉報資訊')
            .setPlaceholder('連結')
            .setValue(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.targetMessage.id}\n============\n${interaction.targetMessage.author.tag} (${interaction.targetMessage.author.id}) 說：\n${interaction.targetMessage.content || '無訊息'}`)
            .setRequired(true);
        // 創建文本輸入組件
        const SuggestionsInput = new TextInputComponent()
            .setCustomId('reason')
            // 設定為必填
            .setRequired(true)
            // 標籤是用戶看到此輸入的提示
            .setLabel('為何舉報此訊息?')
            // 短意味著只有一行文本
            .setStyle('SHORT')
            .setPlaceholder('例：不雅字眼、違反社群規定...')
            .setMinLength(2)
            .setMaxLength(20);
        const OthersInput = new TextInputComponent()
            .setCustomId('whatelse')
            .setLabel('還有其他的嗎?')
            // 段落表示多行文字。
            .setStyle('PARAGRAPH')
            .setPlaceholder('如果還有其他的東西，可在這裡做詳細的說明')
            .setValue('無');
        // 一個動作行只包含一個文本輸入，
        // 所以每個文本輸入需要一個操作行。
        const ActionRow = new MessageActionRow().addComponents(reportmsg);
        const firstActionRow = new MessageActionRow().addComponents(SuggestionsInput);
        const secondActionRow = new MessageActionRow().addComponents(OthersInput);
        // 向模態添加輸入
        modal.addComponents(ActionRow, firstActionRow, secondActionRow);
        // 向用戶顯示模態
        await interaction.showModal(modal);
        /*
        const embed = new container.Discord.MessageEmbed()
             .setTitle('舉報成功！')
             .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
             .setColor('RANDOM')
             .setDescription('我們將會盡快處理！感謝您的配合！');
             */
        // embeds: [embed], ephemeral: true
    },
};
