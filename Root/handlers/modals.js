const fs = require("fs");
const colors = require("colors");

/**
 *
 * @param {import('./../bot').client} client
 * @param {import("./../../Config")} config
 * @returns "?"
 */
module.exports = (client, config) => {
    client.console('Log', ">>> 表單處理程序：".blue);

    const modals = fs.readdirSync(`./Root/commands/modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../commands/modals/${ file }`);

        if (pull.disabled) continue;
        if (pull.id) {
            client.commands.modals.set(pull.id, pull);
            client.console('Log', `[處理 - MODALS] 加載了一個文件: ${ file } (#${ client.commands.modals.size })`.brightGreen);
        } else {
            client.console('Log', `[處理 - MODALS] 無法加載文件 ${ file }。缺少表單 ID。`.red);
            continue;
        }
    }
};
