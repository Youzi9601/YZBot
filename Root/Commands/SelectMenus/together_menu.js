const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    name: 'together_menu',
    /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').SelectMenuInteraction} interaction
   * @param {*} container
   */
    run: async (client, interaction, container) => {

        const type = interaction.values[0];
        // 檢查是否於語音頻道
        if (!interaction.member.voice.channel) {
            const embed = new MessageEmbed()
                .setTitle('啊喔...')
                .setDescription('你不在語音頻道！請先加入語音頻道後再使用！')
                .setColor('RED');
            return interaction.reply({ embeds: [embed] });

            // 命令
        } else if (interaction.member.voice.channel.type == 'GUILD_STAGE_VOICE') {
            const embed = new MessageEmbed()
                .setTitle('啊喔...')
                .setDescription('你不在語音頻道！Together 命令不支援於 **舞台頻道** ！')
                .setColor('RED');
            return interaction.reply({ embeds: [embed] });

        } else client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, `${type}`).then(async invite => {

            const voice_channel = interaction.guild.members.cache.get(client.user.id).voice.channel;

            if (voice_channel && voice_channel.id != interaction.member.voice.channel.id) {

                interaction.channel.send(`一起在這裡！ \n> ${invite.code}`);
                interaction.deferReply({ ephemeral: true }).then(cmd => {
                    interaction.editReply({ content: '因為我目前在其他的頻道中...所以無法加入您的頻道！' });
                });
            } else {
                const { joinVoiceChannel } = require('@discordjs/voice');
                joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.channel.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                interaction.channel.send(`一起在這裡！ \n> ${invite.code}`);
                interaction.deferReply().then(cmd => {
                    interaction.deleteReply();
                });

            }
        });

        //
    },
};
