/*
更新機器人
Heroku 無法更新
*/

const fs = require('fs');
const childProcess = require('child_process');


async function update() {
    if (fs.existsSync('./.git')) {
        const exec = require('child_process').exec;
        await exec('git reset --hard');
        console.log('\x1b[34m%s\x1b[0m', '更新......');
        await exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '錯誤: ' + err);
                return;
            }
            // console.log('' + stdout + '');
            if (!stdout.includes('Already up to date.')) {
                console.log('\x1b[32m%s\x1b[0m', '更新成功！請重新啟動！');
                process.exit(0);
            } else {
                console.log('\x1b[32m%s\x1b[0m', '沒有新的更新！');
            }

        });
        console.log('\x1b[34m%s\x1b[0m', '安裝依賴項......');
        childProcess.exec('npm install', (err, stdout, stderr) => {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', '錯誤: ' + err);
                return;
            }
            console.log('' + stdout + '');
            console.log('\x1b[32m%s\x1b[0m', 'Package.json 中的依賴項安裝完成！');
            // exec('node bot.js');

        });
    } else {
        console.log('\x1b[31m%s\x1b[0m', '沒有 git 存儲庫！');
    }
}
update();
