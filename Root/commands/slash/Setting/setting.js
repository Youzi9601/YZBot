const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('機器人相關頻道設定')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .addSubcommand(s =>
            s
                .setName('language')
                .setDescription('機器人的語言')
                .addStringOption(o =>
                    o
                        .setName('lang')
                        .setDescription('語言')
                        .setChoices(
                            [
                                {
                                    name: '繁體中文',
                                    value: 'zh-TW',
                                },
                            ],
                        ),
                ),
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Setting'],
    disabled: true,
    /**
     *
     * @param {import('../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {

        throw '此命令並未正式開放！';

    },
};