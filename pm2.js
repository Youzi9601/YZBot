(async () => {
    // 下載npm
    const exec = require('child_process').exec;
    await exec('pm2 start bot.js --watch --name "YZB"');
})