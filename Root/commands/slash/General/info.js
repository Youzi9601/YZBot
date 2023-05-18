const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('取得資訊')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .addSubcommand(s =>
            s
                .setName('user')
                .setDescription('取得使用者於此伺服器的資訊')
                .addUserOption(u =>
                    u
                        .setName('user')
                        .setDescription('成員 (預設為自己)')
                        .setRequired(false),
                ),
        )
        .addSubcommand(s =>
            s
                .setName('server')
                .setDescription('取得此伺服器的資訊'),
        )
        .toJSON(),
    clientPermissions: ['SendMessages'],
    OnlyRunOnGuilds: true,
    type: ['Main', 'General'],
    cooldown: 10000,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == 'user') {
            await require('./info-func/user').load(client, interaction, config, db);
        } else if (subcommand == 'server') {
            await require('./info-func/server').load(client, interaction, config, db);
        } else return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('未知的命令')
                    .setDescription("啊喔... 你跑到了哪裡?")
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                    })
                    .setTimestamp()
                    .setColor(0xf24e43),
            ],
            ephemeral: true,
        });
    },
};

