const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    CommandInteraction,
} = require('discord.js');
const { translate_Level } = require('./../../../Language/Language');
const { get_time_from_id } = require('../../../Structures/Handlers/get_time_from_id');
module.exports = {
    command: {
        name: 'info',
        description: '資訊',
        options: [
            // #region info
            {
                type: 1,
                name: 'user',
                description: '取得成員資訊',
                options: [
                    {
                        type: 6,
                        name: 'user',
                        description: '成員',
                        required: false,
                    },
                ],
            },
            {
                type: 1,
                name: 'server',
                description: '取得伺服器資訊',
                options: [
                ],
            },
            {
                type: 1,
                name: 'about-me',
                description: '關於我！',
                options: [
                ],
            },
        ],
        // #endregion
    },
    OnlyRunOnGuilds: true,
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 10000,
    /**
     *
     * @param {import('discord.js').Client} client 機器人
     * @param {CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == 'server') {
            // #region server
            // 選單
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('info_server')
                        .setPlaceholder('請選擇資訊類別')
                        .addOptions([
                            {
                                label: '基本',
                                description: '基本的伺服器資訊',
                                value: 'normal',
                            },
                            {
                                label: '成員',
                                description: '成員統計',
                                value: 'members',
                            },
                            {
                                label: '身分組',
                                description: '身分組統計',
                                value: 'roles',
                            },
                            {
                                label: '頻道',
                                description: '頻道統計',
                                value: 'channels',
                            },
                            {
                                label: '表情符號&貼圖',
                                description: '表情符號與貼圖統計',
                                value: 'emojis-stikers',
                            },
                            {
                                label: '其他',
                                description: '有關其他的資訊',
                                value: 'others',
                            },
                        ]),
                );
            // 嵌入
            const serverinfo = new MessageEmbed()
                .setTitle('伺服器資訊')
                .setDescription('請選擇一個類別！')
                .setAuthor({
                    name: `${interaction.guild.name}`,
                })
                .setFooter({ text: `ID: ${interaction.guild.id}` })
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({
                    text: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                    iconURL: `${interaction.member.user.displayAvatarURL({
                        dynamic: true,
                    })}`,
                });
            if (interaction.guild.iconURL()) {
                serverinfo.image = { url: `${interaction.guild.iconURL({ dynamic: true })}` };
                serverinfo.author.iconURL = interaction.guild.iconURL({ dynamic: true });
            }
            if (interaction.guild.bannerURL()) {
                serverinfo.thumbnail = { urll: interaction.guild.bannerURL };
            }


            // 返回訊息
            interaction.reply({ embeds: [serverinfo], components: [row] });
            // #endregion
        } else if (subcommand == 'user') {
            // #region user

            // 取得成員
            const user = interaction.options.getMember('user') || interaction.user || client.user;
            const member = await interaction.guild.members.fetch(user).catch(() => { });

            // 選單
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('info_user')
                        .setPlaceholder('請選擇資訊類別')
                        .addOptions([
                            {
                                label: '基本',
                                description: '基本的成員資訊',
                                value: 'normal',
                            },
                            {
                                label: '身分組',
                                description: '成員所擁有的身分組',
                                value: 'roles',
                            },
                            {
                                label: '權限',
                                description: '成員所擁有的權限',
                                value: 'permissions',
                            },
                            {
                                label: '其他',
                                description: '有關其他的資訊',
                                value: 'others',
                            },
                        ]),
                );
            // 嵌入
            const userinfo = new MessageEmbed()
                .setTitle('成員資訊')
                .setDescription('請選擇一個類別！')
                .setAuthor({
                    name: `${member.nickname ?
                        member.nickname + ' (' + user.tag + ')'
                        : user.tag}`,
                    iconURL: `${user.displayAvatarURL({ dynamic: true }) || user.avatarURL({ dynamic: true }) || user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${user.id}` })
                .setColor('RANDOM')
                .setTimestamp();
            /**
             if (member.id == `${client.user.id}`) {
                userinfo = new container.Discord.MessageEmbed()
                .addFields({
                    name: `更多資訊`,
                    value: [
                        `伺服器數量`,
                        `${client.guilds.cache.size}`,
                        `成員數量`,
                        `${client.users.cache.size}`,
                        `Node.JS版本`,
                        `${process.version}`,
                    ].join(`\n`),
                })
            }
             */
            // 返回訊息
            interaction.reply({ embeds: [userinfo], components: [row] });
            // #endregion
        } else if (subcommand == 'about-me') {
            // #region bot

            // 取得成員
            const user = client.user;
            const member = await interaction.guild.members.fetch(user).catch(() => { });
            // 取得時間
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('info_user')
                        .setPlaceholder('請選擇資訊類別')
                        .addOptions([
                            {
                                label: '基本',
                                description: '我的資訊',
                                value: 'normal',
                            },
                            {
                                label: '身分組',
                                description: '我所擁有的身分組',
                                value: 'roles',
                            },
                            {
                                label: '權限',
                                description: '成員所擁有的權限',
                                value: 'permissions',
                            },
                            {
                                label: '其他',
                                description: '有關其他的狀態資訊',
                                value: 'others',
                            },
                        ]),
                );

            // 嵌入
            const userinfo = new MessageEmbed()
                .setTitle('成員資訊')
                .setDescription('請選擇一個類別！')
                .setAuthor({
                    name: `${member.nickname ?
                        member.nickname + ' (' + user.tag + ')'
                        : user.tag}`,
                    iconURL: `${user.displayAvatarURL({ dynamic: true }) || user.avatarURL({ dynamic: true }) || user.defaultAvatarURL}`,
                })
                .setFooter({ text: `ID: ${user.id}` })
                .setColor('RANDOM')
                .setTimestamp();

            // 返回訊息
            interaction.reply({ embeds: [userinfo], components: [row] });
            // #endregion
        }
    },
};

