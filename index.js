/**
 * 這是一個主要檔案，其實沒放甚麼東西 owo
 * 因為不想要主目錄放太多東西，所以改成這裡。
 */
const fs = require('fs');
const config = require('./Config');
const exec = require('child_process').exec;

run()
async function run() {

    // 偵測是否有git資料夾
    if (`${config.update.auto}`== `true` && fs.existsSync('./.git')) {
        exec('git reset --hard', (err, stdout, stderr) => {
            if (err) {
                console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            if (stdout) {
                console.log(stdout)
            }
            if (stderr) {
                console.warn(stderr)
            }
        });
        exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            if (stdout) {
                console.log(stdout)
            }
            if (stderr) {
                console.warn(stderr)
            }
            // 如果回傳紀錄不包含已更新
            if (!stdout.includes('Already up to date.')) {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]更新成功！請重新啟動！');
                process.exit(0);
            } else {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]已經是最新的版本！');
            }

        });

    }

    // 執行安裝依賴項目
    if (`${config.update.install_package}` == `true`)
    {
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]安裝依賴項......');
    exec('npm install', (err, stdout, stderr) => {
        if (err) {
            console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
            return;
        }
        console.log('' + stdout + '');
        console.log('\x1b[32m%s\x1b[0m', '[基本作業] Package.json 中的依賴項安裝完成！');
        // exec('node bot.js');

    });
    }
    // 執行機器人檔案
    require('./Root/shared')
}