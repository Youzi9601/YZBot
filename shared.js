const { ShardingManager } = require('discord.js');
const config = require('./Config')
const manager = new ShardingManager('./bot.js', { token: config.bot.token });

manager.on('shardCreate', shard => console.log(`啟動分片 #${shard.id}`));

manager.spawn();