const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('列出全部的機器人命令')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Main', 'General'],
    disabled: false, // 記得改成false再來執行這側是
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const category_language = client.language_data(interaction.locale, 'command').category

        // let client_commands = interaction.client.application.commands.cache

        // const contextmenu_user_commands = client.contextmenu_user_commands
        // const contextmenu_message_commands = client.contextmenu_message_commands
        // const prefix_commands = client.prefix_commands

        const commands = interaction.client.slash_commands;
        const data = {};
        const category = client.command_category

        const applications = (await client.application.commands.fetch())

        // 處理結構化
        commands.forEach(command => {
            if (!command.type.includes('Main')) return;

            let id;
            applications.forEach(c => {
                if (c.name == command.data.name)
                    id = c.id
            })

            const commandName = `</${command.data.name}:${id}>`;
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
                    currentCommand.options.push(`\`${optionName} (${option.description})\``);
                });
            }

            if (command.data.options && command.data.options.some(option => option.type === 1)) {
                command.data.options.filter(option => option.type === 1).forEach(subCommandData => {
                    const subCommandName = `</${command.data.name} ${subCommandData.name}:${id}>`;
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
                            currentSubCommand.options.push(`\`${optionName} (${option.description})\``);
                        });
                    }
                });
            }
        });


        // 處理嵌入
        const embed = new EmbedBuilder()
            .setTitle('命令列表')
        // 處理選單
        const selectmenu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
        category.forEach(t => {
            selectmenu.addOptions(
                {
                    label: category_language[t],
                    description: `${category_language[t]}類別的命令`,
                    value: t,
                },
            )
        })


        // 處理文字
        let helpMessage = '';
        for (const [commandName, commandData] of Object.entries(data)) {
            helpMessage += `${commandName} | ${commandData.description}\n`;
            if (commandData.options.length > 0) {
                helpMessage += `> ${commandData.options.join(', ')}\n`;
            }
            for (const [subCommandName, subCommandData] of Object.entries(commandData.subcommands)) {
                helpMessage += `> ${subCommandName} | ${subCommandData.description}\n`;
                if (subCommandData.options.length > 0) {
                    helpMessage += `> - ${subCommandData.options.join(', ')}\n`;
                }
            }
            helpMessage += '\n';
        }
        embed.setDescription(`以下是命令列表：\n<> 必填 | [] 可選\n\n${helpMessage}`)


        // 處理交互列
        const row = new ActionRowBuilder()
            .addComponents(selectmenu)

        await interaction.reply({ embeds:[embed], components:[row] });


    },
};
