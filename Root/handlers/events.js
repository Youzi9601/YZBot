require("colors");
const { glob } = require("glob");


/**
 *
 * @param {import('./../bot').client} client
 * @returns "?"
 */
module.exports = async (client) => {
    client.console('Log', ">>> 事件處理程序：".blue);

    const events = await glob(`Root/events/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of events) {

        let pull = require(`${__dirname}/../../${file}`.replaceAll('\\', '/'));

        if (pull.name) {
            if (pull.disabled)
                continue;
            if (pull.once) {
                client.once(pull.name, (...args) => pull.execute(client, ...args));
            } else {
                client.on(pull.name, (...args) => pull.execute(client, ...args));
            }
            client.events.set(pull.name, pull);
            client.console('Log', `[處理 - EVENTS] 加載了一個文件： ${pull.name} (#${client.events.size})`.brightGreen);
        } else {
            client.console('Log', `[處理 - EVENTS] 無法加載文件 ${file}。缺少別名或是執行內容。`.red);
            continue;
        }

    }

    client.console('Log', ">>> 事件處理程序處理完成".blue);
};