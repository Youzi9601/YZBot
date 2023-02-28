require('colors');
// const superDjs = require("super-djs");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns "?"
 */
module.exports = async (client) => {
    const mongo = process.env.database_MongoDB || client.config.database.MongoDB;

    let db;
    let db_type;

    switch (client.config.database.use) {
    case "none":
        console.warn(`[#${ client.shard.ids }]  [DATABASE] 不使用資料庫，跳過，部分功能將無法正常運行！`.yellow);
        db_type = 'none';
        break;

    case "mongoose":
        console.log(`[#${client.shard.ids}]  [DATABASE] 正在連接到 MongoDB...`.yellow);

        if (!mongo) {
            console.err(`[#${client.shard.ids}]  ` + "[DATABASE] 未提供 Mongoose URI/URL！".yellow);
            process.exit(1);
        } else {
            const mongoose = require('mongoose');
            mongoose.set('strictQuery', true);
            const mongoose_db = mongoose.connection;
            // 與資料庫連線發生錯誤時
            mongoose_db.on('err', err => {
                console.error(`[#${ client.shard.ids }]  [DATABASE] 發生錯誤：`);
                console.error(err);
            });

            await mongoose.connect(mongo)
                .then(d => {
                    console.log(`[#${ client.shard.ids }]  [DATABASE] Mongoose 資料庫已連線！`.green);
                    db_type = 'mongoose';
                })
                .catch(e => {
                    console.error(`[#${ client.shard.ids }]  [DATABASE] Mongoose 資料庫無法使用！將關閉機器人！`.red);
                    console.error(e);
                    process.exit(1);
                });
        // superDjs.connectMongoDB(mongo, true, superDjs.colourText('[DATABASE] 連接到 MongoDB！', 'green'));
        }
        break;

    case "quick.db":
        console.log(`[#${client.shard.ids}]  [DATABASE] 資料庫使用 quick.db`.yellow);
        db_type = 'quick.db';
        break;

    case "locateStorge":
        console.log(`[#${client.shard.ids}]  [DATABASE] 使用本地 locateStorge 來儲存資料`.yellow);
        db_type = 'locateStorge';
        break;

    default:
        console.log(`[#${ client.shard.ids }]  [DATABASE] 未知的資料庫選擇，跳過使用，部分功能將無法正常運行！`.yellow);
        db_type = 'none';
        break;
    }

    client.db = require(`./database/${db_type}.js`);
};

/**
 * 資料儲存方式
 *
 * Database
 * Guild Table(guilds)
 *     (guildid): {
 *          data: {
 *          },
 *          logs: {
 *              [資料內容]
 *          }
 *     }
 * Client Table(client)
 *     機器人資料
 *
 * Json檔案
 * Storage/
 *      client/
 *          機器人資料
 *      guilds/
 *          (guildID)/
 *              {data}
 *              logs
 */