const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
};
module.exports = {
    command: {
        name: 'fun',
        description: '遊戲系列',
        options: [
            {
                type: 1,
                name: '8ball',
                description: '神奇海螺? 他會用各種方式來同意/拒絕你的問題！',
                options: [
                    {
                        type: 3,
                        name: 'text',
                        description: '你想問的內容... 就看它怎麼回應了uwu',
                        required: true,
                    },
                ],
            },
            {
                type: 1,
                name: 'google',
                description: 'Google? 他可是你的好夥伴！',
                options: [
                    {
                        type: 3,
                        name: 'search',
                        description: '搜索關鍵字',
                        required: true,
                    },
                ],
            },
            {
                type: 1,
                name: 'get-ip',
                description: '從 網址 或 ip 取得它的資訊',
                options: [
                    {
                        type: 3,
                        name: 'where',
                        description: '你想要知道的 ip/網址',
                        required: true,
                    },
                ],
            },
        ],
    },
    // ignoreFile: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == '8ball') {
            const data = require('./../../../Language/zh-TW/Placeholder.json');
            const items = data['8ball'];
            const random = items[Math.floor(Math.random() * items.length)];
            let msg = new MessageEmbed()
                .setAuthor({
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    name: client.user.username + '之神奇海螺',
                })
                .addFields(
                    {
                        name: '回應',
                        value: `${random}`,
                    },
                    {
                        name: '原問題',
                        value: `||${interaction.options.getString('text')}||`,
                    },
                )
                .setColor('RANDOM');
            // 騙人把戲
            if (random == 'error_1') {
                msg = new MessageEmbed()
                    .setAuthor({
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: client.user.username + '之神奇海螺',
                    })
                    .addFields(
                        {
                            name: '回應',
                            value: '剛才的是騙你的！(awa',
                        },
                        {
                            name: '原問題',
                            value: `||${interaction.options.getString('text')}||`,
                        },
                    )
                    .setColor('RANDOM');
                interaction.reply(':x: 此指令交互失敗');
                await sleep(3000);
                interaction.followUp({
                    embeds: [msg],
                    // ephemeral: true,
                });
            }
            // 一般
            else interaction.reply(
                {
                    embeds: [msg],
                    // ephemeral: true,
                },
            );

        }
        //
        else if (subcommand == 'get-ip') {
            const axios = require('axios');
            const dns = require('dns');

            dns.lookup(`${interaction.options.getString('where')}`, (err, address, family) => {
                const ip = address;
                axios(
                    `http://ip-api.com/json/${ip}?fields=66846719&lang=en`,
                ).then((data) => {

                    const json = data.data;
                    console.log(json);
                    let msg = {};
                    msg = new MessageEmbed()
                        .setAuthor({
                            iconURL: `${interaction.user.displayAvatarURL({ dynamic: true }) || interaction.user.defaultAvatarURL}`,
                            name: interaction.user.tag,
                        })
                        .addFields(
                            {
                                name: '搜尋',
                                value: interaction.options.getString('where') + '\u200B',
                                inline: false,
                            },
                            {
                                name: 'IP',
                                value: ip + '\u200B',
                                inline: true,
                            },
                            {
                                name: '時區',
                                value: json.timezone + '\u200B',
                                inline: true,
                            },
                            {
                                name: '國家',
                                value: json.country + '\u200B',
                                inline: true,
                            },
                            {
                                name: '地區(洲)、城市、區',
                                value: json.regionName + '\u200B' + ' | ' + json.city + '\u200B' + (json.district ? ' | ' + json.district : ''),
                                inline: true,
                            },
                            {
                                name: '網路服務商',
                                value: json.isp + '\u200B',
                                inline: true,
                            },
                            {
                                name: 'As 登記',
                                value: json.as + '\u200B',
                                inline: true,
                            },
                        )
                        .setColor(interaction.guild.me.displayHexColor);

                    //
                    if (json.status != 'success') {
                        interaction.reply(`:x: 啊喔... 查詢 ${interaction.options.getString('where')} 無結果:/`);
                    } else interaction.reply(
                        {
                            embeds: [msg],
                            // ephemeral: true,
                        },
                    );
                });

                /*
                if (err) {
                    interaction.reply(`:x: 啊喔... 查詢 ${interaction.options.getString('where')} 無結果:/`);
                }
                */
                //
            });


        }
        //
        else if (subcommand == 'google') {

            const search = interaction.options.getString('search');
            await interaction.reply({
                embeds: [
                    {
                        title: 'Google搜尋',
                        description: `這是您的搜索結果 <@${interaction.user.id}>...\n\n搜索: ||${search}||\n\n鏈接: [點擊這裡](https://www.google.com/search?q=${encodeURIComponent(search)})`,
                        color: 0xFFFFFF,
                        author: {
                            name: 'Google 搜索查詢',
                            icon_url: 'https://lh3.googleusercontent.com/6kf0Q1jk8i1YHbjpx1tkukx-eNjoR9u8At_saPrhHPU9YJ90H_UQfnZvZIawUWNXYISWXzoeFZlNKIfIJbK3L9gCOG8=w1000-e365',
                        },

                    },
                ],
            });
        }
        // 內容
        else interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
    },
};