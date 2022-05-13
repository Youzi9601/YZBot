module.exports = {
    name: '舉報訊息',
    type: 'MESSAGE',
    run: async (client, interaction, container) => {
        console.info(
            interaction.channel.messages.cache.get(interaction.targetId) ??
            (await interaction.channel.messages.fetch(interaction.targetId)),
        );
        const embed = new Discord.MessageEmbed()
            .setTitle('舉報成功！')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            .setDescription('我們將會盡快處理！感謝您的配合！');
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
