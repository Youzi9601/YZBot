const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { exec } = require('child_process');

module.exports = {
    config: {
        name: "exec",
        description: "執行終端機",
        usage: "eval [執行內容]",
    },
    owner: true,
    /**
     *
     * @param {import('./../../../bot').client} client
     * @param {import('discord.js').Message} message
     * @param {*} args
     * @param {*} prefix
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, message, args, prefix, config, db) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('刪除輸出')
                    .setStyle(ButtonStyle.Danger),
            );

        if (!args[0]) {
            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("缺少參數")
                        .setDescription("請提供一個參數！")
                        .setFooter({
                            text: client.user.username,
                            iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
                        })
                        .setTimestamp(),
                ],
                components: [row],
            });
        }

        const lola = args.join(' ');
        if (!lola) return message.channel.send('請輸入要在**終端機**中執行的內容！');
        exec(`${lola}`, (error, stdout) => {
            const response = (error || stdout);
            if (error) {
                message.channel.send({
                    content: `\`\`\`js\n${error.message.replace(client.config.bot.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
                client.console('Log', '終端機>  ' + error.message.replace(client.config.bot.token, '機器人Token'));
            } else {
                message.channel.send({
                    content: `\`\`\`js\n${response.replace(client.config.bot.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
                client.console('Log', '終端機>  ' + response.replace(client.config.bot.token, '機器人Token'));
            }
        });
    },
};
