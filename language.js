require('dotenv').config();
module.exports = {
    /**
   *
   * 語言Language 設定檔案
   * > 這是一個語言設定檔案，裡面的相關設定可以自由變更！或許可以嗆一點?溫柔一點?還是正常一點比較好！
   *
   * 格式：
   *
   * //敘述內容
   * //預設值："內容"
   *
   * 設定名稱: process.env.設定名稱(我們預設的) || "您要的文字內容"
   * (process.env.lang_設定名稱 的設定檔案也是跟Config一樣，位在 ".env" 檔案裡面！)
   *
   */

    /**
     *
     * 基本
     *
     */
    // 時間格式
    date_front: process.env.lang_date || 'YYYY-MM-DD hh:mm:ss',
    boolean: {
        // 傳回
        yes: "是",
        no: "否",
        // 布林值
        true: "真",
        false: "假",
    },
    /**
     *
     * 機器人的啟動控制
     *
     */
    bot: {
        on: '啟動',
        off: '關閉',
        reon: '重新啟動',
    },
    /**
     *
     * 機器人的警報系統
     *
     */

    //

    /**
     *
     * 命令
     *
     */
    commands: {
        help: {
            name: '幫助列表'
        },
        info: {
            user: {
                name: '成員資訊',
                no_game: '沒有遊玩的遊戲',
            },
            server: {
                name: '伺服器資訊'
            },
        },
    },
};

