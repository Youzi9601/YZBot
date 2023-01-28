const client = require("./../../../bot");
const colors = require("colors");

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[準備] ${client.user.tag} 完成登入！`.brightGreen);
})