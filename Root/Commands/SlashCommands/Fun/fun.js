const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
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
    ignoreFile: true,
    run: async (client, interaction, container) => {
        // 內容
        interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
    },
};