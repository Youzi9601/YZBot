const config = require("./../../Config");
const superDjs = require("super-djs");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = (client) => {
    console.log(superDjs.colourText('[DATABASE] 正在連接到 MongoDB...', 'yellow'));
    const mongo = process.env.MongoDB || config.database.MongoDB;

    if (!mongo) {
        console.warn("[WARN] 未提供 Mongo URI/URL！ （不需要）");
    } else {
        superDjs.connectMongoDB(mongo, true, superDjs.colourText('[DATABASE] 連接到 MongoDB！', 'green'));
    }
};
