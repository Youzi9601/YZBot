const { ShardingManager } = require('discord.js');
const config = require('./Config')
const CI = process.env.CI

if (CI) {
    console.log('分片系統 >>> CI檢查完畢'.green)
    process.exit(0)
} else {
    console.log('分片系統 >>> CI跳過檢查'.gray)
}

const manager = new ShardingManager('./bot.js',
    {
        shardArgs: ['--ansi', '--color'],
        execArgv: ['--trace-warnings'],
        token: config.bot.token,
        totalShards: isNaN(config.sharding.amount) ? 'auto' : Number(config.sharding.amount),
        respawn: true,
    },
);


manager.on('shardCreate', shard => {
    console.log(`[#${ shard.id }]  啟動分片 #${ shard.id }`)
    shard.on('ready', r => {
        console.log("分片 #" + shard.id + " 已回傳完成啟動");
    })

    shard.on('message', message => {
        console.log(`[#${shard.id}]  ${message}`);
    });

    shard.on("death", (process) => {
        console.error("分片 #" + shard.id + " 意外關閉！ PID：" + process.pid + "; 退出代碼：" + process.exitCode + ".");

        if (process.exitCode === null) {
            console.warn("警告: 分片 #" + shard.id + " 以 null 錯誤代碼退出。這可能是缺少可用系統內存的結果。確保分配了足夠的內存以繼續。");
        }
    });
    shard.on('reconnecting', (event) => {
        console.warn("分片 #" + shard.id + " 正在重新連接...");
        console.log(event);
    });
    shard.on("disconnect", (event) => {
        console.warn("分片 #" + shard.id + " 斷開連接。正在轉儲套接字關閉事件...");
        console.log(event);
    });
    shard.on('error', err => {
        console.error("分片 #" + shard.id + " 發生錯誤：" + err.name);
        console.error(err.message);
        if (err.stack) console.error(err.stack)
    })
});

manager
    .spawn()
    .then((_shards) => {
        console.log('成功啟動' + manager.totalShards + '個分片！')
    })
    .catch(console.error);
