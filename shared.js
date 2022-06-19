const Cluster = require('discord-hybrid-sharding');
const ms = require('ms');
const config = require('./Config');

let totalShards;
if (config.hosting.totalShards == 'auto') totalShards = 'auto'
else totalShards = Math.round(config.hosting.totalShards)
const manager = new Cluster.Manager(`${__dirname}/bot.js`, {
    totalShards: 'auto',  // 或 'auto' 
    /// 檢查下面的更多選項
    shardsPerClusters: 3,
    // totalClusters: 7,
    mode: 'process', // you can also choose "worker"
    token: config.token,
    // 自動分片設定
    respawn: true,


    restarts: {
        max: 3,
        interval: ms('5d'),
        current: 10000,
    },


    //避免的東西
    execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
});

manager.on('clusterCreate', cluster =>
    console.log(`\n\n\n\n\n==============================\n啟動> 集群#${cluster.id} 啟動！\n==============================`)
);

let amount;
if (config.sharding.amount == 'auto') amount = 'auto'
else amount = Math.round(config.sharding.amount)
manager.spawn({
    amount: 'auto',
    timeout: -1,
    delay: ms('7s')
});