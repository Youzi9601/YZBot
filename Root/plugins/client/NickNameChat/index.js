/**
 *
 * @param {import('./../../../bot').client} client
 */
module.exports = async (client) => {

    /**
     * 按鈕格式：
     * nnc-匿名者ID-messageID
     * 選單格式：
     * ncc-select
     * 表單格式：
     * ncc-動作
     */
    client.console('Log', `[+NickNameChat - Load] 當前已在斜線命令中讀取`.brightGreen);

    /**
     * @name 步驟：
     * 輸入命令 /nickchat send
     * 開啟表單
     * 輸入內容並發送
     *
     * 點選訊息按鈕
     * 執行選單操作
     * 給予相應回饋
     */
};

