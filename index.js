/**
 * 這是一個主要檔案，其實沒放甚麼東西 owo
 * 因為不想要主目錄放太多東西，所以改成這裡。
 */
const fs = require('fs');
const config = require('./Config');
const exec = require('child_process').exec;
const version = require('./package.json').version;

const CI = process.env.CI

if (CI) {
    console.log('分片系統 >>> CI檢查完畢')
    process.exit(0)
} else {
    console.log('分片系統 >>> CI跳過檢查')
}


update()
    .then(() => {
        run();
    });
async function update() {

    // 偵測是否有git資料夾
    if (`${ config.update.auto }` == `true` && fs.existsSync('./.git')) {

        await execPromise('git reset --hard')
            .catch(err => {
                if (err) {
                    console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                    return;
                }
            })
        await execPromise('git pull')
            .then((stdout, stderr) => {
                // 如果回傳紀錄不包含已更新
                if (!stdout.includes('Already up to date.')) {
                    console.log('\x1b[32m%s\x1b[0m', '[基本作業]更新成功！請重新啟動！');
                    process.exit(0);
                } else {
                    console.log('\x1b[32m%s\x1b[0m', '[基本作業]已經是最新的版本！');
                }
            })
            .catch(err => {
                if (err) {
                    console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                    return;
                }
            })

    }

}

async function run() {
    console.log(
        [' __   ___________    ____  _                       _   ____        _    ',
            ' \\ \\ / /__  / __ )  |  _ \\(_)___  ___ ___  _ __ __| | | __ )  ___ | |_  ',
            '  \\ V /  / /|  _ \\  | | | | / __|/ __/ _ \\| \'__/ _` | |  _ \\ / _ \\| __| ',
            '   | |  / /_| |_) | | |_| | \\__ \\ (_| (_) | | | (_| | | |_) | (_) | |_  ',
            '   |_| /____|____/  |____/|_|___/\\___\\___/|_|  \\__,_| |____/ \\___/ \\__| ' + `  v${version}`,
            '                    [=| -= Made By Youzi9601 =-  |=]                    ',
            '                                                                        ',
        ].join('\n'),
    )


    // 執行安裝依賴項目
    if (`${ config.update.install_package }` == `true`) {

        console.log('\x1b[34m%s\x1b[0m', '[基本作業]安裝依賴項......');
        await execPromise('npm install')
            .catch(err => {
                if (err) {
                    console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                    return;
                }
            })

    }
    // 執行機器人檔案
    require('./Root/shared')
}


/**
 * 執行函數
 * @param 'EXECCOMMAND' command 執行控制台命令
 * @returns err / stdout&stderr
 */
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error('\x1b[31m%s\x1b[0m', '[基本作業]錯誤: ' + err);
                reject(err);
            } else {
                console.log(stdout)
                console.warn(stderr)
                resolve({ stdout, stderr });
            }
        });
    });
}


['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
    process.on(signal, async () => {
        console.log(`\n\n關機｜收到 ${ signal } 信號，關閉機器人......`);
        console.log(
            `` + '───────────────────────────────機器人控制台───────────────────────────────\n',
        );
    })
})