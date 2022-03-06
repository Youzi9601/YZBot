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
    name: 'userinfo',
    description: '使用者資訊',
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    cooldown: 10000,
    run: async (client, interaction, container) => {
        // 取得成員
        const user = interaction.options.getMember('user') || client.user.id
        // 取得時間
        const DISCORD_EPOCH = 1420070400000;

        function convertSnowflakeToDate(snowflake) {
            return new Date(snowflake / 4194304 + DISCORD_EPOCH);
        }
        const input = `${user}`;
        const snowflake = Number(input.replace(/[^0-9]+/g, ''));
        const timestamp = convertSnowflakeToDate(snowflake);
        const create_at = `${Math.floor(timestamp.getTime() / 1000)}`;
        // 嵌入
        const userinfo = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('成員資訊')
            .setThumbnail(
                `${interaction.guild.iconURL() || client.user.displayAvatarURL()}`,
            )
            .setDescription(' ')
            .setFooter({
                text: `${interaction.member.user.tag}`,
                iconURL: `${interaction.member.user.displayAvatarURL({
                    dynamic: true,
                })}`,
            })
            .addFields({
                name: '名稱',
                value: `${interaction.user.tag}`,
                inline: true,
            })
            .addFields({
                name: 'ID',
                value: `${interaction.user.id}`,
                inline: true,
            })
            .addFields({
                name: '創建時間',
                value: `<t:${create_at}:R>`,
            })

        // 返回訊息
        interaction.reply({ embeds: [userinfo] });
    },
};
