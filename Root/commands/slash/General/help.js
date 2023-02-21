const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('給予機器人的幫助列表')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    disabled: true, // 記得改成false再來執行這側是
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        let commands = require('./../../../../Storage/test.json')
        console.log(client.application.commands.OWOXD) // 嘗試修正這邊的取得命令問題。
        commands.map(command => {
            const app_command = client.application.commands.cache.find((x) => x.name == command.data.name);
            console.log(app_command)
            return `</${command.data.name}:${app_command?.id}>`
        });
        const prefix_commands = client.prefix_commands
        const slash_commands = client.slash_commands
        const contextmenu_user_commands = client.contextmenu_user_commands
        const contextmenu_message_commands = client.contextmenu_message_commands

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(commands.join('\n'))
                    .setColor('Blue'),
            ],
            ephemeral: true,
        })
    },
};

