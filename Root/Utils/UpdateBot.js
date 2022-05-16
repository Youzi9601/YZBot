/*
更新機器人
Heroku 無法更新
*/

const fs = require('fs');
const childProcess = require('child_process');


async function update() {
    const exec = require('child_process').exec;
    if (fs.existsSync('./.git')) {
        await exec('git reset --hard');
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]開始檢查更新......');
        await exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            // console.log('' + stdout + '');
            if (!stdout.includes('Already up to date.')) {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]更新成功！請重新啟動！');
                process.exit(1);
            } else {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]沒有新的更新！');
            }

        });
        console.log('\x1b[34m%s\x1b[0m', '[基本作業]安裝依賴項......');
        childProcess.exec('npm install', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                return;
            }
            console.log('' + stdout + '');
            console.log('\x1b[32m%s\x1b[0m', '[基本作業] Package.json 中的依賴項安裝完成！');
            // exec('node bot.js');

        });
    } else {
        console.log('\x1b[31m%s\x1b[0m', '沒有 git 存儲庫！將為您創立一個！');

        await exec('git clone https://github.com/Youzi9601/YZBot', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]無法創建！取消自動更新！');
                return;
            } else {
                console.log('\x1b[32m%s\x1b[0m', '[基本作業]創立成功！請將新增的資料夾(YZBot)內的所有內容放置主目錄，並重新啟動機器人！');
                process.exit(0);
            }

        });

    }
}
update();
