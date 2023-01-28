const fs = require("fs");
const colors = require("colors");

module.exports = (client, config) => {
    console.log(">>> 模態處理程序：".blue);

    const modals = fs.readdirSync(`./Root/modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../modals/${file}`);
        if (pull.id) {
            client.modals.set(pull.id, pull);
            console.log(`[HANDLER - MODALS] 加載了一個文件: ${file}`.brightGreen)
        } else {
            console.log(`[HANDLER - MODALS] 無法加載文件 ${file}。缺少模式 ID。`.red)
            continue;
        }
    }
};
