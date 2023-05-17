require("colors");
const { glob } = require("glob");


/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = async (client) => {
    client.console('Log', ">>> 機器人插件處理程序：".blue);

    const plugins = await glob(`Root/plugins/client/**/index.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of plugins) {

        try {
            require(`${__dirname}/../../${file}`.replaceAll('\\', '/'))(client);
            client.console('Log', `[處理 - PLUGINS] 加載了一個文件： ${file}`.brightGreen);

        } catch (error) {
            client.console('Log', `[處理 - PLUGINS] 無法加載文件 ${ file }。`.red);
            client.console('Error', undefined, undefined, undefined, error);
            continue;
        }
    }
    client.console('Log', ">>> 插件處理程序處理完成".blue);
};