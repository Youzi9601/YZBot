const { ShardingManager } = require('discord.js');
const config = require('./Config')
const CI = process.env.CI

if (CI) {
    console.log('分片 >>> CI檢查完畢'.green)
    process.exit(0)
} else {
    console.log('分片 >>> CI跳過檢查'.grey)
}
const manager = new ShardingManager('./bot.js', { token: config.bot.token });

manager.on('shardCreate', shard => console.log(`啟動分片 #${shard.id}`));

manager.spawn();