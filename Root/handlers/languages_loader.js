const fs = require("fs");

/**
 *
 * @param {import('discord.js').Client} client
 * @param {*} config
 */
module.exports = (client, config) => {
    client.console.log(">>> 語言檔案處理程序：".blue);

    // 語言
    fs.readdirSync('./Root/languages/').forEach((dir) => {
        if (dir.endsWith('.md')) return;
        // 檔案路徑
        const langfiles = fs.readdirSync(`./Root/languages/${ dir }`).filter((file) => file.endsWith('.json'));
        for (let file of langfiles) {
            let pull = require(`../languages/${dir}/${file}`);
            client.language.set(dir + '/' + file.replace('.json', ''), pull);
            client.console.log(`讀取語言檔案: ${dir + '/' + file.replace('.json', '')}`.brightGreen);
        }
    });

    // 設定全部語言包
};