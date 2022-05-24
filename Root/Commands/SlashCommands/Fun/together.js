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
        options: [
            {
                type: 1,
                name: 'youtube',
                description: '一起觀看 Youtube！',
                options: [],
            },
            {
                type: 1,
                name: 'poker',
                description: '一起 玩撲克牌！',
                options: [],
            },
            {
                type: 1,
                name: 'chess',
                description: '一起 玩西洋棋！',
                options: [],
            },
            {
                type: 1,
                name: 'checkers',
                description: '一起 玩跳棋！',
                options: [],
            },
            {
                type: 1,
                name: 'betrayal',
                description: '一起 玩Betrayal.io！',
                options: [],
            },
            {
                type: 1,
                name: 'fishing',
                description: '一起 釣魚！',
                options: [],
            },
            {
                type: 1,
                name: 'lettertile',
                description: '一起玩 字母遊戲！',
                options: [],
            },
            {
                type: 1,
                name: 'wordsnack',
                description: '一起玩 字母小吃！',
                options: [],
            },
            {
                type: 1,
                name: 'doodlecrew',
                description: '一起玩 Doodle Crew！',
                options: [],
            },
            {
                type: 1,
                name: 'spellcast',
                description: '一起玩 Spell Cast！',
                options: [],
            },
            {
                type: 1,
                name: 'awkword',
                description: '一起玩 Awkword',
                options: [],
            },
            {
                type: 1,
                name: 'puttparty',
                description: '一起玩 推桿派對',
                options: [],
            },
            {
                type: 1,
                name: 'sketchheads',
                description: '一起玩 Sketchheads',
                options: [],
            },
            {
                type: 1,
                name: 'ocho',
                description: '一起玩 Ocho',
                options: [],
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

        } else client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, `${subcommand}`).then(async invite => {

            const voice_channel = interaction.guild.members.cache.get(client.user.id).voice.channel;

            if (voice_channel && voice_channel.id != interaction.member.voice.channel.id) {

                interaction.channel.send(`一起在這裡！ \n> ${invite.code}`);
                interaction.deferReply({ ephemeral: true }).then(cmd => {
                    interaction.editReply({ content: '因為我目前在其他的頻道中...所以無法加入您的頻道！' });
                });
            } else {
                const { joinVoiceChannel } = require('@discordjs/voice');
                joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.channel.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                interaction.channel.send(`一起在這裡！ \n> ${invite.code}`);
                interaction.deferReply().then(cmd => {
                    interaction.deleteReply();
                });
            }
        });

    },
};