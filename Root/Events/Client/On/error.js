const chalk = require('chalk');
const Box = require('cli-box');
const { config } = require('./../../../../bot');
const moment = require('moment');
const { Client } = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'error',
    once: false,
    /**
     * @param {import('discord.js').Client} client 機器人
     * @param {error} e
     */
    run: async (e, client) => {
        if (`${config.console.error}` == 'false') return;
        console.error(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR\n`) + `${e}`);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR｜${e}`, function(err) {
            if (err)
                console.info(err);
        });

        // 發送回報
        const report = client.channels.cache.get(
            config.Channels.report,
        );
        report.send({
            content: `<@!${require('Config').ownerId}>`,
            embeds: [new MessageEmbed()
                .setTitle(`${e.name} 錯誤！`)
                .setDescription(`錯誤訊息：${e.message}`)
                .setFields({
                    name: '出現位置',
                    value:
                        e?.fileName
                            ? `${e?.fileName}${e?.lineNumber
                                ? `:${e?.lineNumber}${e?.columnNumber
                                    ? `:${e?.columnNumber}`
                                    : ''}`
                                : ''}`
                            : '無',
                }),
            ],
        });

        // end
    },
};
