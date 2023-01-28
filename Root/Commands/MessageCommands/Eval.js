const { inspect } = require('util');
const { log } = require('./../../Utils/log');
module.exports = {
    name: 'eval',
    ownerOnly: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Message} message
     * @param {*} args
     * @param {*} container
     * @returns null
     */
    run: async (client, message, args, container) => {
        Object.assign(this, container);
        const row = new container.Discord.MessageActionRow()
            .addComponents(
                new container.Discord.MessageButton()
                    .setCustomId('delete')
                    .setLabel('刪除輸出')
                    .setStyle('DANGER'),
            );
        let code = args.join(' ').trim();
        const originalCode = code;
        if (!code) return message.channel.send('請輸入要評估 javascript 代碼 的內容！');
        try {
            if (originalCode.includes('--str')) code = `${code.replace('--str', '').trim()}.toString()`;
            if (originalCode.includes('--send')) code = `message.channel.send(${code.replace('--send', '').trim()})`;
            if (originalCode.includes('--async')) code = `(async () => {${code.replace('--async', '').trim()}})()`;
            code = code.replace('--silent', '').trim();
            code = await eval(code);
            code = inspect(code, { depth: 0 });
            if (String(code).length > 1990) code = 'Error: 輸出結果過長';
            if (String(code).includes(container.Config.token)) code = 'Error: 此訊息包含客戶端的令牌！';
            if (originalCode.includes('--silent')) return;
            else {
                message.reply({
                    content: `\`\`\`js\n${code}\n\`\`\``,
                    components: [row],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
                log('info', 'JS偵錯>' + code, false);
            }
        } catch (error) {
            console.info(error);
            message.channel.send({
                content: `\`\`\`js\n${error}\n\`\`\``,
                components: [row],
            });
            log('error', 'JS偵錯>' + error, true, client);
        }
    },
};
