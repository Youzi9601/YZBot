const { ShardingManager } = require('discord.js');
const config = require('../Config')

const manager = new ShardingManager('Root/bot.js',
    {
        shardArgs: ['--ansi', '--color'],
        execArgv: ['--trace-warnings'],
        token: config.bot.token,
        totalShards: isNaN(config.sharding.amount) ? 'auto' : Number(config.sharding.amount),
        respawn: true,
    },
);

const { QuickDB } = require('quick.db')
const uptime = new QuickDB().table('uptime')
uptime.deleteAll().then(() => {
    console.log('清除Uptime狀態資料庫')
})
manager.on('shardCreate', shard => {

    console.log(`[#${ shard.id }]  啟動分片 #${ shard.id }`)
    shard.on('ready', async r => {
        await uptime.set(`${shard.id}`, 'ready')
        console.log("分片 #" + shard.id + " 已回傳完成啟動");
    })

    shard.on('message', message => {
        if (config.sharding.logFetchClientValues) {
            console.log(`[#${ shard.id }]  傳回 process:`);
            console.log(message);
        }
    });

    shard.on("death", async (process) => {
        await uptime.set(`${shard.id}`, 'death')

        console.error("分片 #" + shard.id + " 意外關閉！ PID：" + process.pid + "; 退出代碼：" + process.exitCode + ".");

        if (process.exitCode === null) {
            console.warn("警告: 分片 #" + shard.id + " 以 null 錯誤代碼退出。這可能是缺少可用系統內存的結果。確保分配了足夠的內存以繼續。");
        }
    });
    shard.on('reconnecting', async (event) => {
        await uptime.set(`${shard.id}`, 'ready')

        console.warn("分片 #" + shard.id + " 正在重新連接...");
        console.log(event);
    });
    shard.on("disconnect", async (event) => {
        await uptime.set(`${shard.id}`, 'disconnect')

        console.warn("分片 #" + shard.id + " 斷開連接。正在轉儲套接字關閉事件...");
        console.log(event);
    });
    shard.on('error', err => {
        console.error("分片 #" + shard.id + " 發生錯誤：" + err.name);
        console.error(err.message);
        if (err.stack) console.error(err.stack)
    })
});


// 執行分片生成與刷新資料
manager
    .spawn()
    .then((_shards) => {
        console.log('成功啟動' + manager.totalShards + '個分片！')
        // 執行設定資料
        // 執行Web
        manager.broadcastEval(async client => {
            if (client.shard.ids == 0) {
                const promises = [
                    client.shard.fetchClientValues('guilds.cache.size'),
                    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)),

                ];
                Promise.all(promises)
                    .then(results => {
                        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                        const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                        const totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
                        const db = require('quick.db').QuickDB
                        const client_db = new db().table('client')

                        // 儲存
                        client_db.set('servers', totalGuilds)
                        client_db.set('users', totalMembers)
                        client_db.set('channels', totalChannels)
                    })
                    .catch(console.error);
            }

            const { ActivityType } = require('discord.js')
            const wait = require('node:timers/promises').setTimeout;
            await wait(5000)
            client.user.setPresence({ activities: [{ name: `分片#${client.shard.ids}｜機器人`, type: ActivityType.Competing }], status: 'online' });

        });
    })
    .catch(console.error);

process
    .on('exit', (code) => {
        //
        console.log(`[分片系統]  關機｜退出代碼: ${ code }`);
    })
    .on('beforeExit', async (code) => {
        console.log(`[分片系統]  關機｜退出代碼: ${ code }，執行關閉前緩衝...`);

        manager.shards.forEach(s => {
            s.kill();
            uptime.set(s.id, 'death')
        })
    });
//