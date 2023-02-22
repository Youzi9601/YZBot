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
        let commands = [];
        client.application.commands.cache.forEach((command) => {
            let commandStr = `</${command.name}:${command.id}>`;
            if (command.options) {
                command.options.forEach((option) => {
                    commandStr += `\n -- ${option.name}`;
                });
            }
            commands.push(commandStr);
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
