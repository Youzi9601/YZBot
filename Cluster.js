const { Client } = require('discord-cross-hosting');
const Cluster = require('discord-hybrid-sharding');
const config = require('./Config');

const client = new Client({
    agent: 'bot',
    host: config.hosting.ip, // Domain without https
    port: Math(config.hosting.port), // Proxy Connection (Replit) needs Port 443
    // handshake: true, When Replit or any other Proxy is used
    authToken: config.hosting.authToken,
});
client.on('debug', console.log);
client.connect();

const manager = new Cluster.Manager(`${__dirname}/bot.js`,
    {
        totalShards: config.hosting.totalShards,
        totalClusters: 'auto'
    }
); // Some dummy Data

manager.on('clusterCreate',
    cluster => console.log(`啟動>> 集群 #${cluster.id} 啟動！`)
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