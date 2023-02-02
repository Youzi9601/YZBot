const fs = require("fs");
const colors = require("colors");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = (client) => {
    console.log(`[#${client.shard.ids}]  ` + ">>> 事件處理程序：".blue);

    fs.readdirSync('./Root/events/').forEach(dir => {
        const commands = fs.readdirSync(`./Root/events/${dir}`).filter(file => file.endsWith('.js'));
        for (let file of commands) {

            let pull = require(`../events/${dir}/${file}`);
            if (pull.name) {
                client.events.set(pull.name, pull);
                console.log(`[#${client.shard.ids}]  [處理 - EVENTS] 加載了一個文件： ${pull.name} (#${client.events.size})`.brightGreen)
            } else {
                console.log(`[#${client.shard.ids}]  [處理 - EVENTS] 無法加載文件 ${file}。缺少姓名或別名。`.red)
                continue;
            }

        }
    });
}