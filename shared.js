const Cluster = require('discord-hybrid-sharding');
const config = require('./Config');

const manager = new Cluster.Manager(`${__dirname}/bot.js`, {
    totalShards: config.hosting.totalShards, // or 'auto'
    totalClusters: 'auto',
    mode: 'process', // you can also choose "worker"
    token: config.token,
});

manager.on('clusterCreate', cluster => console.log(`啟動> 集群#${cluster.id} 啟動！`));
manager.spawn({ timeout: -1 });