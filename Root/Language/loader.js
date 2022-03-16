const config = require(`../../Config`)
const fs = require(`fs`)
const path = require("path");

module.exports = async () => {
    let language_data = {}
    // 取得基本檔案
    let base = fs.readFileSync(`Root/Language/${config.language}/base.json`, `utf8`)
    language_data.base = base
    // 取得訊息檔案
    let msg = fs.readFileSync(`Root/Language/${config.language}/msg.json`, `utf8`)
    language_data.msg = msg
    // 取得訊息檔案
    let command = fs.readFileSync(`Root/Language/${config.language}/command.json`, `utf8`)
    language_data.command = command
    // 取得表情符號檔案
    let emoji = fs.readFileSync(`Root/Language/${config.language}/emoji.json`, `utf8`)
    language_data.emoji = emoji
}