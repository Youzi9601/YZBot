/**
 * 資料庫架構表
 * 並無任何作用，單純搞一個架構
 */
module.exports = {
    /**
     * 設定資料
     * @param {import('discord.js').Client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @param {*} value 資料內容
     */
    set: async (_client, tablename = 'json', name, value) => {

    },
    /**
     * 取得資料
     * @param {import('discord.js').Client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @returns {*} JSON資料
     */
    get: async (_client, tablename = 'json', name) => {

    },
};