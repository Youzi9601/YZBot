const fs = require("fs");
const colors = require("colors");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = (client) => {
    client.console.log(">>> 事件處理程序：".blue);

    fs.readdirSync('./Root/events/').forEach(dir => {
        const commands = fs.readdirSync(`./Root/events/${dir}`).filter(file => file.endsWith('.js'));
        for (let file of commands) {

            let pull = require(`../events/${dir}/${file}`);
            if (pull.name) {
                if (pull.disabled)
                    continue;
                if (pull.once) {
                    client.once(pull.name, (...args) => pull.execute(client, ...args));
                } else {
                    client.on(pull.name, (...args) => pull.execute(client, ...args));
                }
                client.events.set(pull.name, pull);
                client.console.log(`[處理 - EVENTS] 加載了一個文件： ${pull.name} (#${client.events.size})`.brightGreen);
            } else {
                client.console.log(`[處理 - EVENTS] 無法加載文件 ${file}。缺少別名或是執行內容。`.red);
                continue;
            }

        }
    });
    client.console.log(">>> 事件處理程序處理完成".blue);
};