const { Client } = require('discord-cross-hosting');
const Cluster = require('discord-hybrid-sharding');


//
const fs = require('fs');
const fetch = require('node-fetch');
//(async () => {

//#region 更新系統
update()

async function update() {
    // 更新系統
    const version = require('./package.json').version;

    /** @param {import('./Config.js')} config */
    let config;

    try {
        config = require('./Config');
    } catch (error) {
        config = require('./Config.example');
        console.error('\x1b[31m%s\x1b[0m', '錯誤：沒有 Config.js 檔案！請將 "Config.example.js" 改成 "Config.js"！');
        if (ci != 'true') { // 避免CI執行
            // 如果沒有Config.example.js，自動創建新的
            if (!require('./Config.example')) {
                console.log('\x1b[34m%s\x1b[0m', '因為找不到 Config.example，所以正在從內部資料複製一份 Config.js ');
                await require('./Root/Utils/UpdateBot').config_update(config)
                    .then(() => {
                        console.log('\x1b[34m%s\x1b[0m', 'Config.js 複製成功！');
                    })
                    .catch((err) => {
                        console.error('\x1b[31m%s\x1b[0m', '錯誤：' + err);
                        process.exit(1);
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
    fetch('https://raw.githubusercontent.com/Youzi9601/YZBot/master/package.json')
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
                    console.log('\x1b[32m%s\x1b[0m', '新版本: v' + data.version);
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
//#endregion 更新系統



//

const client = new Client({
    agent: 'bot',
    host: config.hosting.ip, // Domain without https
    port: Math.floor(config.hosting.port), // Proxy Connection (Replit) needs Port 443
    // handshake: true, When Replit or any other Proxy is used
    authToken: config.hosting.authToken,
});
client.on('debug', console.log);
client.connect();



let totalShards;
if (config.hosting.totalShards == 'auto') totalShards = 'auto'
else totalShards = Math.round(config.hosting.totalShards)
const manager = new Cluster.Manager(`${ __dirname }/bot.js`,
    {
        totalShards: totalShards,
        totalClusters: 'auto'
    }
); // Some dummy Data

manager.on('clusterCreate',
    cluster => console.log(`啟動>> 集群 #${ cluster.id } 啟動！`)
);
// manager.on('debug', console.log);

client.listen(manager);
client
    .requestShardData()
    .then(e => {
        if (!e) return;
        if (!e.shardList) return;
        manager.totalShards = e.totalShards;
        manager.totalClusters = e.shardList.length;
        manager.shardList = e.shardList;
        manager.clusterList = e.clusterList;
        manager.spawn({ timeout: -1 });
    })
    .catch(e => console.log(e));

//})