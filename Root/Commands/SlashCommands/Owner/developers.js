const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const moment = require('moment');
const chalk = require('chalk');
const config = require('../../../../Config.js');
//
module.exports = {
    command: {
        name: 'list-servers',
        description: '將機器人所在的所有服務器列出於控制台',
        options: [
            {
                name: 'list-servers',
                description: '將機器人所在的所有服務器列出於控制台',
                type: 1,
            },
            {
                name: 'leave-server',
                description: '讓機器人退出伺服器',
                type: 1,
                options: [
                    {
                        type: 10,
                        name: 'id',
                        description: '伺服器ID',
                        required: true,
                    },
                ],
            },
        ],
        defaultPermission: false,
        /*
        locales: {
            'default': 'en',
            'zh-TW': {
                'name': '列出伺服器',
                'description': '列出所在的所有伺服器',
            },
        },
        */
        permissions: [
            {
                id: `${config.developers[0]}`,
                type: 'USER',
                permission: true,
            },
        ],
    },
    ownerOnly: true,
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();

        // #region list-servers
        if (subcommand == 'list-servers') {
            client.guilds.cache.forEach((guild) => {
                console.info(
                    chalk.gray(
                        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                    ) +
                    chalk.gray('└ ') +
                    `${guild.name} | ${guild.id} | 所有者 ${guild.ownerId
                    } \n                        └ 總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size
                    }人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                );
            });

            // 發送訊息
            const msg = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription('伺服器列表已列於控制台！');
            interaction.reply({
                embeds: [msg],
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
        } else
        // #endregion

        // #region leave-server
        if (subcommand == 'leave-server') {
            const id = interaction.options.getString('id');
            const guild = client.guilds.cache.get(id);
            try {
                if (!guild) {
                    return interaction.reply({ content: '未指定公會 ID。請指定公會ID' });
                }

                await guild.leave();
                interaction.reply({ content: `離開 **${guild.name}**和 \`${guild.memberCount}\` 成員。` });
            } catch (err) {
                interaction.reply({ content: `離開服務器時發生錯誤： \`${err.message}\`` });
            }
        }
        // #endregion
        //
    },
};