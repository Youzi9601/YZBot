const moment = require('moment');
const chalk = require('chalk');
const { config } = require('../../../../bot');
//
module.exports = {
    command: {
        name: 'developers',
        description: '機器人的危險設定',
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
                        type: 3,
                        name: 'id',
                        description: '伺服器ID',
                        required: true,
                    },
                ],
            },
            {
                name: 'exit',
                description: '將機器人關機',
                type: 1,
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
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();

        // #region list-servers
        if (subcommand == 'list-servers') {
            const { MessageEmbed } = require('discord.js');
            let i = 1;
            let page = 1;
            const embed = [];
            let field = [];
            client.guilds.cache.forEach(
                /** @param {import('discord.js').Guild} guild */
                (guild) => {

                    if (Math.round(i / 25) == i / 25) {
                        embed.push(
                            new MessageEmbed()
                                .setTitle(`第${page}頁`)
                                .addFields(field)
                                .setColor('WHITE'),
                        );
                        field = [];
                        page++;
                    }
                    field.push(
                        {
                            name: `${i}. ${guild.name} (${guild.id})`,
                            value: [
                                ` 所有者 ${guild.ownerId}`,
                                `總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size}人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                            ].join('\n'),
                            inline: true,
                        },
                    );


                    console.info(
                        chalk.gray(
                            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                        ) +
                        chalk.gray('└ ') +
                        `${guild.name} | ${guild.id} | 所有者 ${guild.ownerId
                        } \n                        └ 總共${guild.memberCount}人 | 成員${guild.members.cache.filter((m) => !m.user.bot).size
                        }人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
                    );

                    i++;
                });
            console.log('embed');
            console.log(embed);
            console.log('field');
            console.log(field);

            if (field != []) {
                embed.push(
                    new MessageEmbed()
                        .setTitle(`第${page}頁`)
                        .addFields(field)
                        .setColor('WHITE'),
                );
            }
            console.log(embed);

            // 發送訊息
            const msg = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setAuthor({
                    name: interaction.member.user.tag,
                    iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription('伺服器列表已列於控制台！');
            // 添加到最前端
            embed.unshift(msg);
            interaction.reply({
                embeds: embed,
                allowedMentions: {
                    repliedUser: false,
                },
                ephemeral: true,
            });
            // interaction.channel.send({ embeds: embed })
        } else
        // #endregion

        // #region leave-server
        if (subcommand == 'leave-server') {
            const id = interaction.options.getString('id');
            const guild = client.guilds.cache.get(id);
            try {
                if (!guild) {
                    return interaction.reply({ content: '未指定伺服器 ID。請指定伺服器ID' });
                }

                await guild.leave();
                interaction.reply({ content: `成功離開 **${guild.name}**，少了\`${guild.memberCount}\`位成員。` });
            } catch (err) {
                interaction.reply({ content: `離開伺服器時發生錯誤： \`${err.message}\`` });
            }
        }
        // #endregion
        // #region exit
        if (subcommand == 'exit') {
            interaction.reply({ content: '關閉機器人......' })
                .then((msg) => { process.exit(0); });
        }
        // #endregion
        //
    },
};
