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
        console.log(`[#${ client.shard.ids }]  [DATABASE] 不使用資料庫，跳過`.yellow);
        break;
    case "mongoose":
        console.log(`[#${client.shard.ids}]  [DATABASE] 正在連接到 MongoDB...`.yellow);

        if (!mongo) {
            console.warn(`[#${client.shard.ids}]  ` + "[DATABASE] 未提供 Mongoose URI/URL！ 將改成 quick.db 來儲存資料".yellow);
            db_type = 'quick.db';
        } else {
            const mongoose = require('mongoose');
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
                    console.error(`[#${ client.shard.ids }]  [DATABASE] Mongoose 資料庫無法使用！`.red);
                    console.error(e);
                    db_type = 'quick.db';
                });
        // superDjs.connectMongoDB(mongo, true, superDjs.colourText('[DATABASE] 連接到 MongoDB！', 'green'));
        }
        break;
    default:
        console.log(`[#${ client.shard.ids }]  [DATABASE] 未知的資料庫選擇，跳過使用！`.yellow);
        break;
    }

};
