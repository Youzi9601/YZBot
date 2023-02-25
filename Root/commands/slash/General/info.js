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
    type: ['Main', 'General'],
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == 'user') {
            await require('./info/user').load(client, interaction, config, db);
        } else if (subcommand == 'server') {
            await require('./info/server').load(client, interaction, config, db);
        } else return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("啊喔... 你跑到了哪裡?")
                    .setColor('Red'),
            ],
            ephemeral: true,
        });
    },
};

