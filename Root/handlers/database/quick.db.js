/**
 * Quick.db
 */
const { QuickDB } = require('quick.db');
module.exports = {
    /**
     * 設定資料
     * @param {import('discord.js').Client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @param {Object} value 資料內容
     */
    set: async (_client, tablename = 'json', name, value) => {
        const db = new QuickDB().table(tablename);
        await db.set(name, value);
    },
    /**
     * 取得資料
     * @param {import('discord.js').Client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @returns {Object} JSON資料集
     */
    get: async (_client, tablename = 'json', name) => {
        const db = new QuickDB().table(tablename);
        return await db.get(name) || {};
    },
};