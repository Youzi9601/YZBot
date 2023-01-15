/** @param {import('./Config.js')} config */
let config;

//(async () => {
const fs = require('fs');
const fetch = require('node-fetch');

/*
browser_launch();
async function browser_launch() {
    const puppeteer = require("puppeteer")
    const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' });
}
*/


//#region 更新系統
update()
    .then(() => {
        run()
    })

async function update() {
    // 更新系統
    const version = require('./package.json').version;


    try {
        config = require('./Config');
    } catch (error) {
        config = require('./Config.example');
        console.error('\x1b[31m%s\x1b[0m', '錯誤：沒有 Config.js 檔案！請將 "Config.example.js" 改成 "Config.js"！');
        if (ci != 'true') { // 避免CI執行
            // 如果沒有Config.example.js，自動創建新的
            if (!require('./Config.example')) {
                console.log('\x1b[34m%s\x1b[0m', '因為找不到 Config.example.js，所以正在從內部資料複製一份 Config.js ');
                await require('./Root/Utils/UpdateBot').config_update(config)
                    .then(() => {
                        console.log('\x1b[34m%s\x1b[0m', 'Config.js 複製成功！');
                    })
                    .catch((err) => {
                        console.error('\x1b[31m%s\x1b[0m', '錯誤：' + err);
                        process.exit(0);
                    });

            }
            // 如果有，則自動更改檔案名稱
            else {
                console.log('\x1b[34m%s\x1b[0m', '有找到 Config.example.js ，正在更改名稱......');
                await rename_config();
                async function rename_config() {
                    return fs.rename('Config.example.js', 'Config.js');
                }
                console.log('\x1b[34m%s\x1b[0m', '更改成功！');

            }
            console.log('\x1b[34m%s\x1b[0m', '請重新啟動機器人！');
            process.exit(0);
        } else {
            console.log('跳過Config修正');
        }
    }

    // 輸出Config
    exports.config = config;

    // 檢測更新
    await fetch('https://raw.githubusercontent.com/Youzi9601/YZBot/master/package.json')
        .then((res) => res.json())
        .then((data) => {
            if (data.version != version || `${ config.commit }` == 'true') {

                // 執行自動更新，不跳通知
                if (`${ config.autoupdate }` == 'true') {
                    // 下載npm
                    // const exec = require('child_process').exec;
                    // pm2 start bot.js --watch --name "YZB"
                    // await exec('npm i');
                    UpdateBot();
                    async function UpdateBot() {
                        require('./Root/Utils/UpdateBot');
                    }

                    // 不執行更新，但跳出通知
                } else {
                    console.log('\x1b[32m%s\x1b[0m', '───────────────────────────────機器人更新───────────────────────────────');
                    console.log('\x1b[32m%s\x1b[0m', '更新: v' + version + ' -> v' + data.version);
                    console.log('\x1b[32m%s\x1b[0m', `啟動機器人後於Discord輸入 \`${ config.prefix[0] }exec npm run update\` 來更新機器人`);
                    console.log('\x1b[36m%s\x1b[0m', '檢查提交: https://github.com/Youzi9601/YZBot/commits/master');
                    console.log('\x1b[32m%s\x1b[0m', '───────────────────────────────機器人更新───────────────────────────────');

                }

            } else {
                console.log('\x1b[32m%s\x1b[0m', '沒有可用的更新');
            }
        })
        .catch((err) => {
            console.log('\x1b[31m%s\x1b[0m', err);
        });
}
//})
//#endregion 更新系統



//#region 主程式
function run() {
    /**
     *
     * 分片伺服器
     * 用於超過2500個伺服器的時候
     */

    const config = require('./Config');

    const { ShardingManager } = require('discord.js');

    if (!config.token) {
        console.error(
            chalk.bgRed(
                '沒有找到 token! 請在 config.js 中輸入您的token!\n請訪問：https://discord.com/developers/application 獲取token',
            ),
        );
        process.exit(0);
    }

    const manager = new ShardingManager('./bot.js', {
        totalShards: 'auto',
        token: config.token,
    });

    // Emitted when a shard is created
    manager.on('shardCreate',
        (shard) => console.log(`> 分片 ${ shard.id } 啟動`),
    );

    // Spawn your shards
    manager.spawn();
}
    //#endregion 主程式