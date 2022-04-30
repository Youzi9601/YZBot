const chalk = require('chalk');
const Box = require('cli-box');
const config = require('../../../../Config.js');
const moment = require('moment');
const { Client } = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'warn',
    once: false,
    /**
     * @param {Client} client
     * @param {error} e
     */
    run: async (e, client) => {
        if (config.console.warn == false) return;
        console.warn(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN\n`) + `${e}`);
        fs.appendFile(`logs/${moment().format('YYYY-MM-DD')}.log`, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN｜${e}`, function(err) {
            if (err)
                console.log(err);
        });

        // 發送回報
        const reportChannel = client.channels.cache.get(
            config.Channels.reportChannel,
        );
        reportChannel.send({
            content: `<@!${require('Config.js').ownerId}>`,
            embeds: [new MessageEmbed()
                .setTitle(`${e.name} 警告！`)
                .setDescription(`警告訊息：${e.message}`)
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
