/**
 *
 * @param {string} text Permissions名稱
 * @param {string} lang 語言
 * @returns 翻譯結果
 */
function translate_Permissions(text, lang) {
    const translate = require(`./${lang}/Placeholder.json`).Permissions;
    const output = translate[text] || text;
    return output;
}
/**
 *
 * @param {string} text 錯誤訊息名稱
 * @param {string} lang 語言
 * @returns 翻譯結果
 */
function translate_CommandOptions(text, lang) {
    const translate = require(`./${lang}/error.json`).error.CommandOptions;
    const output = translate[text] || text;
    return output;
}
/**
 *
 * @param {string} text 驗證等級
 * @param {string} lang 語言
 * @returns 翻譯結果
 */
function translate_Level(text, lang) {
    const translate = require(`./${lang}/Placeholder.json`).Level;
    const output = translate[text] || text;
    return output;
}
/**
 *
 * @param {string} tier 等級
 * @param {string} lang 語言
 * @returns 翻譯結果
 */
function translate_Tier(tier, lang) {
    const translate = require(`./${lang}/Placeholder.json`).Tier;
    const output = translate[tier] || text;
    return output;
}


// 輸出
module.exports = {
    translate_Permissions,
    translate_CommandOptions,
    translate_Level,
    translate_Tier,
};