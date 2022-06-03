/**
 * 這，是一個驗證檔案，刪除了，這個專案基本上我就難以幫你維護了，
 * 我想說，如果你真的要這麼做，我們將會撤銷你有關使用YZB的機器人檔案的所有權，
 * 那......就祝你好運，你可以更改/新增文件內容，但是禁止宣稱你的所有喔！
 * 詳情請看 MIT LICENSE。
 */

module.exports = {
    name: 'youzi',
    ownerOnly: false,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Message} message
     * @param {*} args
     * @param {*} container
     * @returns null
     */
    run: async (client, message, args, container) => {

        if (message.author.id == '856918496893599805') {
            message.reply(
                {
                    content: '這是一個由 Youzi 製作的機器人，此為認證號碼：Migwlod，洩漏出去/刪除 此文件將會出現問題，如果有任何問題，請問 Youzi 本人。'
                }
            )
        } else return;
    },
};
