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
        name: 'together',
        description: '一起吧！',
        options: [],
    },
    // ignoreFile: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        // const subcommand = interaction.options.getSubcommand();
        const embed = new MessageEmbed()
            .setAuthor(
                {
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    name: `${client.user.username} 一起吧！`,
                })
            .setColor('RANDOM')
            .setDescription('請選擇一個選項！');
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('together_menu')
                    .setPlaceholder('請選擇資訊類別')
                    .addOptions([
                        {
                            value: 'youtube',
                            description: '一起 觀看Youtube！',
                            label: 'Youtube',
                        },
                        {
                            value: 'poker',
                            description: '一起 玩撲克牌！',
                            label: '撲克牌',
                        },
                        {
                            value: 'chess',
                            description: '一起 玩西洋棋！',
                            label: '西洋棋',
                        },
                        {
                            value: 'checkers',
                            description: '一起 玩跳棋！',
                            label: '跳棋',
                        },
                        {
                            value: 'betrayal',
                            description: '一起 玩Betrayal.io！',
                            label: 'Betrayal.io',
                        },
                        {
                            value: 'fishing',
                            description: '一起 釣魚！',
                            label: '釣魚',
                        },
                        {
                            value: 'lettertile',
                            description: '一起玩 字母遊戲！',
                            label: '字母遊戲',
                        },
                        {
                            value: 'wordsnack',
                            description: '一起玩 單詞小吃！',
                            label: '單詞小吃',
                        },
                        {
                            value: 'doodlecrew',
                            description: '一起玩 Doodle Crew！',
                            label: 'Doodle Crew',
                        },
                        {
                            value: 'spellcast',
                            description: '一起玩 Spell Cast！',
                            label: 'Spell Cast',
                        },
                        {
                            value: 'awkword',
                            description: '一起玩 Awkword',
                            label: 'Awkword',
                        },
                        {
                            value: 'puttparty',
                            description: '一起玩 推桿派對',
                            label: '推桿派對',
                        },
                        {
                            value: 'sketchheads',
                            description: '一起玩 Sketchheads',
                            label: 'Sketchheads',
                        },
                        {
                            value: 'ocho',
                            description: '一起玩 Ocho',
                            label: 'Ocho',
                        },
                    ]),
            );
        // 檢查是否於語音頻道
        if (!interaction.member.voice.channel) {
            const embed = new MessageEmbed()
                .setTitle('啊喔...')
                .setDescription('你不在語音頻道！請先加入語音頻道後再使用！')
                .setColor('RED');
            return interaction.reply({ embeds: [embed] });

            // 命令
        } else if (interaction.member.voice.channel.type == 'GUILD_STAGE_VOICE') {
            const embed = new MessageEmbed()
                .setTitle('啊喔...')
                .setDescription('你不在語音頻道！Together 命令不支援於 **舞台頻道** ！')
                .setColor('RED');
            return interaction.reply({ embeds: [embed] });

        } else {
            interaction.reply({ embeds: [embed], components: [row] });
        }
    },
};