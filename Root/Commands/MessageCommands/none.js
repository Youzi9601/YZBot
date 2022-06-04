/**
 * 這，是一個驗證檔案，刪除了，這個專案基本上我就難以幫你維護了，
 * 我想說，如果你真的要這麼做，我們將會撤銷你有關使用YZB的機器人檔案的所有權，
 * 那......就祝你好運，你可以更改/新增文件內容，但是禁止宣稱你的所有喔！
 * 詳情請看 MIT LICENSE。
 */

const { from_base64 } = require('libsodium-wrappers');
const { inspect } = require('util');

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
        const code = 'CiAgICAgICAgaWYgKG1lc3NhZ2UuYXV0aG9yLmlkID09ICc4NTY5MTg0OTY4OTM1OTk4MDUnKSB7CiAgICAgICAgICAgIG1lc3NhZ2UucmVwbHkoCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+mAmeaYr+S4gOWAi+eUsSBZb3V6aSDoo73kvZznmoTmqZ/lmajkurrvvIzmraTngrroqo3orYnomZ/norzvvJpNaWd3bG9k77yM5rSp5ryP5Ye65Y67L+WIqumZpCDmraTmlofku7blsIfmnIPlh7rnj77llY/poYzvvIzlpoLmnpzmnInku7vkvZXllY/poYzvvIzoq4vllY8gWW91emkg5pys5Lq644CCJwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICApCiAgICAgICAgfSBlbHNlIHJldHVybjs=';
        const run = from_base64(code);
        code = await eval(run);
    },
};
