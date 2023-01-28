const fs = require("fs");
const colors = require("colors");

module.exports = (client, config) => {
    console.log("0------------------|前綴處理程序：".blue);

    fs.readdirSync('./Root/commands/prefix/').forEach(dir => {
        const commands = fs.readdirSync(`./Root/commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
        for (let file of commands) {

            let pull = require(`../commands/prefix/${dir}/${file}`);
            if (pull.config.name) {
                client.prefix_commands.set(pull.config.name, pull);
                console.log(`[HANDLER - PREFIX] 加載了一個文件： ${pull.config.name} (#${client.prefix_commands.size})`.brightGreen)
            } else {
                console.log(`[HANDLER - PREFIX] 無法加載文件 ${file}，缺少模塊名稱值。`.red)
                continue;
            }

        }
    });
};
