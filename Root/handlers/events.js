const fs = require("fs");
const colors = require("colors");

module.exports = (client) => {
  console.log("0------------------| 事件處理程序：".blue);

  fs.readdirSync('./Root/events/').forEach(dir => {
		const commands = fs.readdirSync(`./Root/events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of commands) {

			let pull = require(`../events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
				console.log(`[HANDLER - EVENTS] 加載了一個文件： ${pull.name}`.brightGreen)
			}
 else {
				console.log(`[HANDLER - EVENTS] 無法加載文件 ${file}。缺少姓名或別名。`.red)
				continue;
			}

		}
	});
}