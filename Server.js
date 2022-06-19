const { Bridge } = require('discord-cross-hosting');
const config = require('./Config');

const server = new Bridge({
    port: 4444, // The Port of the Server | Proxy Connection (Replit) needs Port 443
    authToken: config.hosting.authToken,
    totalShards: config.hosting.totalShards, // The Total Shards of the Bot or 'auto'
    totalMachines: config.hosting.totalMachines, // The Total Machines, where the Clusters will run
    token: config.token,
});

server.on('debug', console.log);
server.start();
server.on('ready', url => {
    console.log('伺服器已啟動！ >> ' + url);
    setInterval(() => {
        server.broadcastEval('this.guilds.cache.size').then(console.log).catch(console.log);
    }, 10000);
});