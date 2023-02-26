const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { inspect } = require('util');

module.exports = {
    config: {
        name: "eval",
        description: "執行程式代碼",
        usage: "eval [執行內容]",
    },
    owner: true,
    /**
     *
     * @param {import('discord.js').Client} client
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
                        .setColor('Red'),
                ],
                components: [row],
            });
        }

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
            if (String(code).includes(client.config.bot.token)) code = 'Error: 此訊息包含客戶端的令牌！';
            if (originalCode.includes('--silent')) return;
            else {
                message.reply({
                    content: `\`\`\`js\n${code}\n\`\`\``,
                    components: [row],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
                console.log('JS偵錯>  ' + code);
            }
        } catch (error) {
            console.error(error);
            message.channel.send({
                content: `\`\`\`js\n${error}\n\`\`\``,
                components: [row],
            });
        }

    },
};
