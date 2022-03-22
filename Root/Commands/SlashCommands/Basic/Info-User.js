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
        const user = interaction.options.getMember('user') || interaction.user || client.user
        const member = await interaction.guild.members.fetch(user).catch(() => { });
        // 取得時間
        const DISCORD_EPOCH = 1420070400000;

        function convertSnowflakeToDate(snowflake) {
            return new Date(snowflake / 4194304 + DISCORD_EPOCH);
        }
        const user_input = `${user}`;
        const user_snowflake = Number(user_input.replace(/[^0-9]+/g, ''));
        const user_timestamp = convertSnowflakeToDate(user_snowflake);
        const create_at = `${Math.floor(user_timestamp.getTime() / 1000)}`;
        const user_joinedtime = `${member.joinedTimestamp}`;
        const join_at = `${Math.floor(member.joinedTimestamp / 1000)}`;
        // 嵌入
        const userinfo = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('成員資訊')
            .setThumbnail(
                `${member.displayAvatarURL()}`,
            )
            .setDescription(' ')
            .setFooter({
                text: `${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    dynamic: true,
                })}`,
            })
            .addFields({
                name: '名稱',
                value: `${user.username}`,
                inline: true,
            })
            .addFields({
                name: '匿名',
                value: `${user.nickname || "沒有暱稱"}`,
                inline: true,
            })
            .addFields({
                name: '識別碼',
                value: `${user.discriminator}`,
                inline: true,
            })
            .addFields({
                name: 'ID',
                value: `${member.id}`,
                inline: true,
            })
            .addFields({
                name: '機器人',
                value: `${member.bot ? "是" : "否"}`,
                inline: true,
            })
            .addFields({
                name: '創建時間',
                value: `<t:${create_at}:R>`,
            })
            .addFields({
                name: '加入時間',
                value: `<t:${join_at}:R>`,
            })

        // 返回訊息
        interaction.reply({ embeds: [userinfo] });
    },
};
