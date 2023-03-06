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
                .setDescription('隨機回覆')
                .addSubcommand(c =>
                    c
                        .setName('8ball')
                        .setDescription('神奇的8號球，或許可以回復你一些很奇怪的問題(誤')
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
                        .setName('color')
                        .setDescription('[尚未完成]給予一些隨機的顏色！'),
                ),
        )
        .toJSON(),
    type: ["Fun"],
    disabled: false, // 是否不使用此檔案
    clientPermissions: [], // 機器人需要這些權限
    userPermissions: [], // 使用者需要這些權限

    /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
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
                await require('./fun/8ball').load(client, interaction, config, db);
            } else
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('未知的命令')
                            .setDescription("啊喔... 你跑到了哪裡?")
                            .setColor('Red'),
                    ],
                    ephemeral: true,
                });
        } else if (subcommandGroup == '?') {
            await require('./fun/?').load(client, interaction, config, db);
        } else
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('未知的命令')
                        .setDescription("啊喔... 你跑到了哪裡?")
                        .setColor('Red'),
                ],
                ephemeral: true,
            });
    },
};