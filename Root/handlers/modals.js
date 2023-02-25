const fs = require("fs");
const colors = require("colors");

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("./../../Config")} config
 * @returns "?"
 */
module.exports = (client, config) => {
    console.log(`[#${client.shard.ids}]  ` + ">>> 模態處理程序：".blue);

    const modals = fs.readdirSync(`./Root/commands/modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../commands/modals/${ file }`);

        if (pull.disabled) continue;
        if (pull.id) {
            client.modals.set(pull.id, pull);
            console.log(`[#${client.shard.ids}]  [處理 - MODALS] 加載了一個文件: ${file} (#${client.modals.size})`.brightGreen);
        } else {
            console.log(`[#${client.shard.ids}]  [處理 - MODALS] 無法加載文件 ${file}。缺少模式 ID。`.red);
            continue;
        }
    }
};
