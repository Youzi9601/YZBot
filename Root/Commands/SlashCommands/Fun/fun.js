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
                    }
                ]
            }
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
            const data = require('./../../../Language/zh-TW/Placeholder.json')
            const items = data['8ball']
            let random = items[Math.floor(Math.random() * items.length)];
            let msg = new MessageEmbed()
                .setAuthor({
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    name: client.user.username + '之神奇海螺',
                })
                .addFields(
                    {
                        name: '回應',
                        value: `${random}`
                    },
                    {
                        name: '原問題',
                        value: `||${interaction.options.getString('text')}||`
                    },
                )
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
                            value: `剛才的是騙你的！(awa`
                        },
                        {
                            name: '原問題',
                            value: `||${interaction.options.getString('text')}||`
                        },
                    )
                interaction.reply(':x: 此指令交互失敗')
                await sleep(3000)
                interaction.followUp({
                    embeds: [msg]
                    // ephemeral: true,
                })
            }
            // 一般
            else interaction.reply(
                {
                    embeds: [msg]
                    // ephemeral: true,
                }
            );

        }
        // 內容
        else interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
    },
};