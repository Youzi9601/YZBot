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
    disabled: false,
    setting: {
        options: {
            clientPermissions: ['SendMessages'],
            OnlyRunOnGuilds: true,
            cooldown: 10,
        },
    },
    /**
     *
     * @param {import('./../../../bot').client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const category_language = client.language_data(interaction.locale, 'command#category');
        const translations = client.language_data(interaction.locale, 'commands/slash/General/help');

        // let client_commands = interaction.client.application.commands.cache
        // const contextmenu.user = client.commands.contextmenu.user
        // const contextmenu.message = client.commands.contextmenu.message
        // const message_prefix = client.commands.message_prefix

        const commands = interaction.client.commands.slash;
        const data = {};
        const category = client.command_category;

        const applications = (await client.application.commands.fetch()).concat(await interaction.guild.commands.fetch());

        // 處理結構化
        commands.forEach(command => {
            if (!command.type.includes('Main')) return;

            let id;
            applications.forEach(c => {
                if (c.name == command.data.name)
                    id = c.id;
            });

            const commandName = `</${ command.data.name }:${ id ?? '0' }>`;
            const currentCommand = data[commandName] = {
                description: command.data.description,
                options: [],
                subcommands: {},
                subcommandgroups: {},
            };

            // 如果輸入選像
            if (command.data.options) {
                command.data.options.forEach(option => {
                    if (option.type === 1 || option.type === 2) return;
                    let optionName = option.name;
                    if (option.required) {
                        optionName = `<${ optionName }>`;
                    } else {
                        optionName = `[${ optionName }]`;
                    }
                    currentCommand.options.push(`\`${ optionName } (${ option.description })\``);
                });
            }

            // 如果是子指令
            if (command.data.options && command.data.options.some(option => option.type === 1)) {
                command.data.options.filter(option => option.type === 1).forEach(subCommandData => {
                    const subCommandName = `</${ command.data.name } ${ subCommandData.name }:${ id ?? '0' }>`;
                    const currentSubCommand = currentCommand.subcommands[subCommandName] = {
                        description: subCommandData.description,
                        options: [],
                    };

                    if (subCommandData.options) {
                        subCommandData.options.forEach(option => {
                            let optionName = option.name;
                            if (option.required) {
                                optionName = `<${ optionName }>`;
                            } else {
                                optionName = `[${ optionName }]`;
                            }
                            currentSubCommand.options.push(`\`${ optionName } (${ option.description })\``);
                        });
                    }
                });
            }

            // 如果是子群組指令
            if (command.data.options && command.data.options.some(option => option.type === 2)) {
                command.data.options.filter(option => option.type === 2).forEach(subGroupCommandData => {
                    const subGroupCommandName = `</${ command.data.name } ${ subGroupCommandData.name }:${ id ?? '0' }>`;
                    const currentSubGroupCommand = currentCommand.subcommandgroups[subGroupCommandName] = {
                        description: subGroupCommandData.description,
                        subcommands: {},
                    };

                    if (subGroupCommandData.options) {
                        subGroupCommandData.options.filter(option => option.type === 1).forEach(subCommandData => {
                            const subCommandName = `</${ command.data.name } ${ subGroupCommandData.name } ${ subCommandData.name }:${ id ?? '0' }>`;
                            const currentSubCommand = currentSubGroupCommand.subcommands[subCommandName] = {
                                description: subCommandData.description,
                                options: [],
                            };

                            if (subCommandData.options) {
                                subCommandData.options.forEach(option => {
                                    let optionName = option.name;
                                    if (option.required) {
                                        optionName = `<${ optionName }>`;
                                    } else {
                                        optionName = `[${ optionName }]`;
                                    }
                                    currentSubCommand.options.push(`\`${ optionName } (${ option.description })\``);
                                });
                            }
                        });
                    }
                });
            }

        });


        // 處理嵌入
        const embed = new EmbedBuilder()
            .setTitle(translations["embed_title"])
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
            })
            .setTimestamp()
            .setColor(0x0098d9);
        // 處理選單
        const selectmenu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder(translations["selectmenu_placeholder"]);
        category.forEach(t => {
            selectmenu.addOptions(
                {
                    label: category_language[t],
                    description: `${ translations["selectmenu_option_description"] }`.replace('{{type}}', category_language[t]),
                    value: t,
                },
            );
        });


        // 處理文字
        let helpMessage = '';
        for (const [commandName, commandData] of Object.entries(data)) {
            helpMessage += `${ commandName } | ${ commandData.description }\n`;
            if (commandData.options.length > 0 && commandData.options.length < 8) {
                helpMessage += `> └ ${ commandData.options.join(', ') }\n`;
            }
            for (const [subCommandName, subCommandData] of Object.entries(commandData.subcommands)) {
                helpMessage += `> ├ ${ subCommandName } | ${ subCommandData.description }\n`;
                if (subCommandData.options.length > 0 && subCommandData.options.length < 8) {
                    helpMessage += `> │ └ ${ subCommandData.options.join(', ') }\n`;
                }
            }
            for (const [subCommandGroupName, subCommandGroupData] of Object.entries(commandData.subcommandgroups)) {
                helpMessage += `> ├ ${ subCommandGroupName } | ${ subCommandGroupData.description }\n`;
                for (const [subCommandName, subCommandData] of Object.entries(subCommandGroupData.subcommands)) {
                    helpMessage += `> │ ├ ${ subCommandName } | ${ subCommandData.description }\n`;
                    if (subCommandData.options.length > 0 && subCommandData.options.length < 8) {
                        helpMessage += `> │ │ └ ${ subCommandData.options.join(', ') }\n`;
                    }
                }

            }
            helpMessage += '\n';
        }
        embed.setDescription(`${ translations["embed_description"] }\n\n${ helpMessage }`);


        // 處理交互列
        const row = new ActionRowBuilder()
            .addComponents(selectmenu);

        await interaction.reply({ embeds: [embed], components: [row] });

    },
};
