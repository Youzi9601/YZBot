require('colors');
// const superDjs = require("super-djs");

/**
 *
 * @param {import('./../bot').client} client
 * @returns "?"
 */
module.exports = async (client) => {
    const mongo = process.env.database_MongoDB || client.config.database.MongoDB;

    let db;
    let db_type;

    switch (client.config.database.use) {
    case "none":
        client.console('Warn', `[DATABASE] 不使用資料庫，跳過，部分功能將無法正常運行！`.yellow);
        db_type = 'none';
        break;

    case "mongoose":
        client.console('Log', `[DATABASE] 正在連接到 MongoDB...`.yellow);

        if (!mongo) {
            client.console('Error', "[DATABASE] 未提供 Mongoose URI/URL！".yellow);
            process.exit(1);
        } else {
            const mongoose = require('mongoose');
            mongoose.set('strictQuery', true);
            const mongoose_db = mongoose.connection;
            // 與資料庫連線發生錯誤時
            mongoose_db.on('err', err => {
                client.console('Error', `[DATABASE] 發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, err);
            });

            await mongoose.connect(mongo)
                .then(d => {
                    client.console('Log', `[DATABASE] Mongoose 資料庫已連線！`.green);
                    db_type = 'mongoose';
                })
                .catch(e => {
                    client.console('Error', `[DATABASE] Mongoose 資料庫無法使用！將關閉機器人！`.red);
                    client.console('Error', { promise: e });
                    process.exit(1);
                });
            // superDjs.connectMongoDB(mongo, true, superDjs.colourText('[DATABASE] 連接到 MongoDB！', 'green'));
        }
        break;

    case "quick.db":
        client.console('Log', `[DATABASE] 資料庫使用 quick.db`.yellow);
        db_type = 'quick.db';
        break;

    case "locateStorge":
        client.console('Log', `[DATABASE] 使用本地 locateStorge 來儲存資料`.yellow);
        db_type = 'locateStorge';
        break;

    default:
        client.console('Log', `[DATABASE] 未知的資料庫選擇，跳過使用，部分功能將無法正常運行！`.yellow);
        db_type = 'none';
        break;
    }

    client.db = require(`./database/${ db_type }.js`);
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