/**
 * locateStorge
 */
const fs = require('node:fs');
// 執行作業
module.exports = {
    /**
     * 設定資料
     * @param {import('./../../bot').client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @param {Object} value JSON資料內容
     */
    set: async (_client, tablename = 'json', name, value) => {
        if (tablename != 'json')
            await readTable(tablename);
        const filePath = `Storage/${ tablename == 'json' ? '' : `${ tablename }/` }${ name }.json`;
        await fs.promises.writeFile(filePath, JSON.stringify(value, undefined, 4));
        return;
    },
    /**
     * 取得資料
     * @param {import('./../../bot').client} client 客戶端
     * @param {String} tablename 你的檔案庫名稱
     * @param {String} name 資料名稱
     * @returns {Object} JSON資料集
     */
    get: async (_client, tablename = 'json', name) => {
        await readTable(tablename);
        const filePath = `Storage/${ tablename == 'json' ? '' : `${ tablename }/` }${ name }.json`;
        if (!fs.existsSync(filePath)) {
            // 如果檔案不存在，使用 fs.writeFile 生成一個空白檔案
            await fs.promises.writeFile(filePath, '{}', (err) => {
                if (err) throw err;
            });
        }
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    },
};

/**
 * 儲存的資料夾
 * @param {String} file 資料位置
 */
async function readTable(file) {
    // 先確認路徑是否存在，不存在就建立資料夾
    if (!fs.existsSync('Storage/' + file)) {
        await fs.promises.mkdir('Storage/' + file, { recursive: true });
    }
}