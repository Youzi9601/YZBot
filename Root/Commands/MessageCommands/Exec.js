const { exec } = require('child_process');
const { log } = require('./../../Utils/log');
module.exports = {
    name: 'exec',
    ownerOnly: true,
    run: async (client, message, args, container) => {
        const row = new container.Discord.MessageActionRow()
            .addComponents(
                new container.Discord.MessageButton()
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
                    content: `\`\`\`js\n${error.message.replace(container.Config.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                });
                log('info', '終端機>' + error.message.replace(container.Config.token, '機器人Token'), false);

            } else {
                message.channel.send({
                    content: `\`\`\`js\n${response.replace(container.Config.token, '機器人Token')}\n\`\`\``,
                    components: [row],
                });
                log('info', '終端機>' + response.replace(container.Config.token, '機器人Token'), false);

            }
        });
    },
};