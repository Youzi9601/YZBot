const config = require("./../../Config");
require('colors')
// const superDjs = require("super-djs");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = (client) => {
    console.log(`[#${client.shard.ids}]  [DATABASE] 正在連接到 MongoDB...`.yellow);
    const mongo = process.env.MongoDB || config.database.MongoDB;

    if (!mongo) {
        console.warn(`[#${client.shard.ids}]  ` + "[DATABASE] 未提供 Mongo URI/URL！ （不需要）");
    } else {
        console.error(`[#${client.shard.ids}]  [DATABASE] 當前資料庫系統尚未完成，所以無法使用`.red)
        // superDjs.connectMongoDB(mongo, true, superDjs.colourText('[DATABASE] 連接到 MongoDB！', 'green'));
    }
};
