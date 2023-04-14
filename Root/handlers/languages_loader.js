const fs = require("fs");
const { glob } = require("glob");

/**
 *
 * @param {import('discord.js').Client} client
 * @param {*} config
 */
module.exports = async (client, config) => {
    client.console('Log', ">>> 語言檔案處理程序：".blue);

    // 語言
    fs.readdirSync('./Root/languages/').forEach(async (dir) => {
        if (dir.endsWith('.md')) return;
        const jsonfiles = await glob(`Root/languages/${dir}/**/*.json`, { ignore: 'ignore/**' });
        client.console('Log', `讀取語言檔案: ${dir} (${jsonfiles.length})`.brightGreen);
        // console.log(jsonfiles);
        // 檔案路徑
        for (let file of jsonfiles) {
            const filename = file
                .replaceAll('\\', '/')
                .replace('.json', '')
                .replace(`Root/languages/${ dir }/`, '');
            // console.log(filename);
            let pull = require(__dirname + `/../../${file}`);
            client.language.set(
                `${dir}:${filename}`,
                pull,
            );
            // client.console('Log', `讀取語言檔案: ${filename}`.brightGreen);
        }
    });

    // 設定全部語言包
};