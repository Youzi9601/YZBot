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
    // 取得時間
        const DISCORD_EPOCH = 1420070400000;

        function convertSnowflakeToDate(snowflake) {
            return new Date(snowflake / 4194304 + DISCORD_EPOCH);
        }
        const input = `${interaction.guild.id}`;
        const snowflake = Number(input.replace(/[^0-9]+/g, ''));
        const timestamp = convertSnowflakeToDate(snowflake);
        const create_at = `${Math.floor(timestamp.getTime() / 1000)}`;
        // 嵌入
        const serverinfo = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('伺服器資訊')
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
                name: '基本',
                value: `**伺服器名稱**
        > ${interaction.guild.name} (ID: \`${interaction.guild.id}\`)
        **擁有者**
        > <@${interaction.guild.ownerId}>
        **創建時間**
        > <t:${create_at}:R>
        **人數**
        > 總共 ${interaction.guild.memberCount} 人\n> 成員 ${
    interaction.guild.members.cache.filter((m) => !m.user.bot).size
} 人 / 機器人 ${
    interaction.guild.members.cache.filter((m) => m.user.bot).size
} 人
        **加成**
        > ${interaction.guild.premiumTier} 等級
        > ${interaction.guild.premiumSubscriptionCount} 個加成
        **驗證等級**
        > ${interaction.guild.verificationLevel}
        **語言環境**
        > ${interaction.guild.preferredLocale}
        `,
                inline: true,
            })
            .addFields({
                name: '頻道',
                value: `**統計**
        > ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_TEXT',
    ).size
} 個文字頻道
        > ╰ ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_PUBLIC_THREAD',
    ).size
} 個討論串
        > ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_VOICE',
    ).size
} 個語音頻道
        > ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_NEWS',
    ).size
} 個公告頻道
        > ╰ ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_NEWS_THREAD',
    ).size
} 個討論串
        > ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_STAGE_VOICE',
    ).size
} 個活動頻道
        > ${
    interaction.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_CATEGORY',
    ).size
} 個類別
        **規則頻道**
        > <#${interaction.guild.rulesChannelId}>
        **AFK頻道**
        > <#${interaction.guild.afkChannelId}>
        **小工具頻道**
        > <#${interaction.guild.widgetChannelId}>
        **系統頻道**
        > <#${interaction.guild.systemChannelId}>
        **Discord更新頻道**
        > <#${interaction.guild.publicUpdatesChannelId}>
        `,
                inline: true,
            });
        // 返回訊息
        interaction.reply({ embeds: [serverinfo] });
    },
};
