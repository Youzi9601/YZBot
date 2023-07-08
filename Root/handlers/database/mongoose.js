/**
 * mongoose
 */
const mongoose = require('mongoose');
// 取得模型
const models = {};

/**
 *
 * @param {String} tablename
 * @param {String} name
 * @returns {mongoose.Schema()}
 */
function getModel(tablename, name) {
    if (models[name]) {
        return models[name];
    }

    const dataSchema = require(`./mongoose/models/Schema`)();
    const DataBase = mongoose.model(`${tablename}`, dataSchema);
    models[name] = DataBase;
    return DataBase;
}
module.exports = {
    /**
     * 設定資料
     * @param {import('./../../bot').client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @param {Object} value JSON資料內容
     */
    set: async (_client, tablename = 'json', name, value) => {
        const DataBase = getModel(tablename, `${name}`);
        // 儲存資料到資料庫
        await DataBase.findOneAndUpdate({ id: `${name}` }, { data: JSON.stringify(value) }, { upsert: true });
    },
    /**
     * 取得資料
     * @param {import('./../../bot').client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @returns {Object} JSON資料
     */
    get: async (_client, tablename = 'json', name) => {
        const DataBase = getModel(tablename, name);
        // 取得資料
        const gettedData = await DataBase.findOne({ id:  `${name}` });
        const result = JSON.parse(gettedData?.data || "{}");
        return result;
    },
};

