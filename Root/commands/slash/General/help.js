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
        // let client_commands = interaction.client.application.commands.cache

        const contextmenu_user_commands = client.contextmenu_user_commands
        const contextmenu_message_commands = client.contextmenu_message_commands
        const prefix_commands = client.prefix_commands

        const commands = interaction.client.slash_commands;
        const data = {};

        commands.forEach(command => {
            const commandName = `/${command.data.name}`;
            const currentCommand = data[commandName] = {
                description: command.data.description,
                options: [],
                subcommands: {},
            };

            if (command.data.options) {
                command.data.options.forEach(option => {
                    if (option.type === 1) return;
                    let optionName = option.name;
                    if (option.required) {
                        optionName = `<${optionName}>`;
                    } else {
                        optionName = `[${optionName}]`;
                    }
                    currentCommand.options.push(`${optionName} (${option.description})`);
                });
            }

            if (command.data.options && command.data.options.some(option => option.type === 1)) {
                command.data.options.filter(option => option.type === 1).forEach(subCommandData => {
                    const subCommandName = `${subCommandData.name}`;
                    const currentSubCommand = currentCommand.subcommands[subCommandName] = {
                        description: subCommandData.description,
                        options: [],
                    };

                    if (subCommandData.options) {
                        subCommandData.options.forEach(option => {
                            let optionName = option.name;
                            if (option.required) {
                                optionName = `<${optionName}>`;
                            } else {
                                optionName = `[${optionName}]`;
                            }
                            currentSubCommand.options.push(`${optionName} (${option.description})`);
                        });
                    }
                });
            }
        });

        let helpMessage = '';
        for (const [commandName, commandData] of Object.entries(data)) {
            helpMessage += `${commandName} | ${commandData.description}\n`;
            if (commandData.options.length > 0) {
                helpMessage += `  ${commandData.options.join(', ')}\n`;
            }
            for (const [subCommandName, subCommandData] of Object.entries(commandData.subcommands)) {
                helpMessage += `  - ${subCommandName} | ${subCommandData.description}\n`;
                if (subCommandData.options.length > 0) {
                    helpMessage += `      ${subCommandData.options.join(', ')}\n`;
                }
            }
            helpMessage += '\n';
        }

        await interaction.reply(`以下是命令列表：\n\`\`\`\n<> 必填 | [] 可選\n${helpMessage}\n\`\`\``);


    },
};
