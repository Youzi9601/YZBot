const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fun")
        .setDescription("有趣的命令")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addSubcommandGroup(sub =>
            sub
                .setName('random')
                .setNameLocalizations({ "zh-TW": "隨機" })
                .setDescription('亂數回覆')
                .addSubcommand(c =>
                    c
                        .setName('8ball')
                        .setNameLocalizations({ "zh-TW": "神奇海螺" })
                        .setDescription('神奇海螺(神奇的8號球)，或許可以回復你一些很奇怪的問題(誤')
                        .addStringOption(s =>
                            s
                                .setName('question')
                                .setDescription('你要問的問題')
                                .setMaxLength(100)
                                .setRequired(false),
                        ),
                )
                .addSubcommand(c =>
                    c
                        .setName('gay')
                        .setDescription('誰在搞gay?')
                        .addUserOption(u =>
                            u
                                .setName('member')
                                .setDescription('指定對象')
                                .setRequired(false),
                        ),
                ),
            /*
                .addSubcommand(c =>
                    c
                        .setName('color')
                        .setDescription('[尚未完成]給予一些隨機的顏色！'),
                ),
            */
        )
        .addSubcommandGroup(sub =>
            sub
                .setName('game')
                .setNameLocalizations({ "zh-TW": "遊戲" })
                .setDescription('小遊戲')
                .addSubcommand(c =>
                    c
                        .setName('reaction')
                        .setNameLocalizations({ "zh-TW": "反應力測試" })
                        .setDescription('測試反應力！'),
                )
                .addSubcommand(c =>
                    c
                        .setName('tic-tac-toe')
                        .setNameLocalizations({ "zh-TW": "井字棋" })
                        .setDescription('與其他成員/AI進行對戰')
                        .addUserOption(u =>
                            u
                                .setName('member')
                                .setDescription('想一同對戰的成員(選擇此機器人將進行AI對戰)')
                                .setRequired(true),
                        )
                    ,
                ),
        )
        .toJSON(),
    type: ["Fun"],
    disabled: false, // 是否不使用此檔案
    OnlyRunOnGuilds: true,
    clientPermissions: ['SendMessages'], // 機器人需要這些權限
    userPermissions: [], // 使用者需要這些權限

    /**
   *
   * @param {import('./../../../bot').client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {*} config
   * @param {*} db
   * @returns
   */
    run: async (client, interaction, config, db) => {
        // 執行的內容
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommandGroup == 'random') {
            if (subcommand == '8ball') {
                await require('./fun-func/random/8ball').load(client, interaction, config, db);
            } else if (subcommand == 'gay') {
                await require('./fun-func/random/gay').load(client, interaction, config, db);
            } else
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('未知的命令')
                            .setDescription("啊喔... 你跑到了哪裡?")
                            .setColor(0xf24e43)
                            .setFooter({
                                text: client.user.username,
                                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                            })
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });

        } else if (subcommandGroup == 'game') {
            if (subcommand == 'reaction') {
                await require('./fun-func/game/reaction').load(client, interaction, config, db);
            } else if (subcommand == 'tic-tac-toe') {
                await require('./fun-func/game/tic-tac-toe').load(client, interaction, config, db);
            } else
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('未知的命令')
                            .setDescription("啊喔... 你跑到了哪裡?")
                            .setColor(0xf24e43)
                            .setFooter({
                                text: client.user.username,
                                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                            })
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });

        } else if (subcommandGroup == '?') {
            await require('./fun-func/?').load(client, interaction, config, db);
        } else
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('未知的命令')
                        .setDescription("啊喔... 你跑到了哪裡?")
                        .setColor(0xf24e43)
                        .setFooter({
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                        })
                        .setTimestamp(),
                ],
                ephemeral: true,
            });
    },
};