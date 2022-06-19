const Cluster = require('discord-hybrid-sharding');
const config = require('./Config');

const manager = new Cluster.Manager(`${__dirname}/bot.js`, {
    totalShards: config.hosting.totalShards, // or 'auto'
    mode: 'process', // you can also choose "worker"
    token: config.token,
    // 自動分片設定
    totalClusters: config.hosting.totalShards || 'auto',
    respawn: true,

    /*
    restarts: {
        max: 3,
        interval: 10000,
        current: 60000,
    },
    */

    //避免的東西
    execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
});

manager.on('clusterCreate', cluster => console.log(`啟動> 集群#${cluster.id} 啟動！`));
manager.spawn({ amount: config.sharding.amount, timeout: -1, delay: 10 });