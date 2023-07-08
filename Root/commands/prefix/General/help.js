const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    config: {
        name: "help",
        description: "Replies with help menu.",
    },
    permissions: ['SendMessages'],
    owner: false,
    disabled: true,
    run: async (client, message, args, prefix) => {
        const commands = client.commands.message_prefix.map(command => `${ prefix }${ command.config.name }`);

        return await message.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setAuthor(
                            {
                                name: client.user.tag,
                                iconURL: client.user.displayAvatarURL(
                                    {
                                        dynamic: true,
                                    },
                                ),
                            },
                        )
                        .setDescription(commands.join(', '))
                        .setFooter(
                            {
                                text: `→ Use ${ prefix }info for a command info.`,
                            },
                        )
                        .setColor('Blue'),
                ],
            },
        );

    },
};
