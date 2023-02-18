const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { exec } = require('child_process');

module.exports = {
    config: {
        name: "exec",
        description: "執行終端機",
        usage: "eval [執行內容]",
    },
    owner: true,
    run: async (client, message, args, prefix, config, db) => {

        if (!args[0]) {
            return await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("缺少參數")
                    .setDescription("請提供一個參數！"),
            ] });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('刪除輸出')
                    .setStyle('DANGER'),
            );
        const lola = args.join(' ');
        if (!lola) return message.channel.send('請輸入要在**終端機**中執行的內容！');
        exec(`${lola}`, (error, stdout) => {
            const response = (error || stdout);
            if (error) {
                message.channel.send({
                    content: `\`\`\`js\n${error.message.replace(client.config.bot.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                });
                console.log('終端機>' + error.message.replace(client.config.bot.token, '機器人Token'))
            } else {
                message.channel.send({
                    content: `\`\`\`js\n${response.replace(client.config.bot.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                });
                console.log('終端機>' + response.replace(client.config.bot.token, '機器人Token'))
            }
        });
    },
};
