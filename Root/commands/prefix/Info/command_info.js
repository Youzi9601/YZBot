const { EmbedBuilder, codeBlock } = require("discord.js");

module.exports = {
    config: {
        name: "info",
        description: "Get a command's information.",
        usage: "info [command]",
    },
    permissions: ['SendMessages'],
    owner: false,
    disabled: true,
    run: async (client, message, args, prefix, config, db) => {

        if (!args[0]) {
            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Please provide a command name.")
                        .setColor("Red"),
                ],
            });
        }

        const command = client.prefix_commands.get(args[0].toLowerCase());

        if (!command) {
            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Sorry, but that command doesn't exists.")
                        .setColor("Red"),
                ],
            });
        }

        return await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Command Information: ${command.config.name.toUpperCase()}`)
                    .addFields(
                        { name: 'Description:', value: command.config.description || "No Description was provided." },
                        { name: 'Usage:', value: command.config.usage ? codeBlock('txt', command.config.usage) : "No Usage was provided." },
                        { name: 'Permissions:', value: command.permissions.join(", ") },
                        { name: 'Developer only?', value: command.owner ? 'Yes' : 'No' },
                    )
                    .setColor("Blue"),
            ],
        });

    },
};
