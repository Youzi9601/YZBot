const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "help_menu",
    disabled: false,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").StringSelectMenuInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        const value = interaction.values[0]
        // await interaction.reply(value + '是你的選擇')
        // 取得json的數值
        // let client_commands = interaction.client.application.commands.cache

        // const contextmenu_user_commands = client.contextmenu_user_commands
        // const contextmenu_message_commands = client.contextmenu_message_commands
        // const prefix_commands = client.prefix_commands

        const commands = interaction.client.slash_commands;
        const data = {};

        // 處理結構化
        commands.forEach(command => {
            // 如果不是那一類的就返回
            if (!command.type.includes(value)) return;
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

        // 處理文字
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

        const embed = new EmbedBuilder()
            .setTitle('命令列表')
            .setDescription(`以下是命令列表：\n\`\`\`\n<> 必填 | [] 可選\n${ helpMessage }\n\`\`\``)
            .setColor('Random')
        await interaction.update({ embeds:[embed] });

    },
};
