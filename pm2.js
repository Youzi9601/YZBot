(async () => {
    const sleep = async (ms) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms || 0);
        });
    };
    console.log('啟動');
    const exec = require('child_process').exec;
    exec('npm install -g pm2');
    exec('pm2 link 3rqoycd6hkmav5q 6yc5o7ctk73qr65');
    exec('npm run prod:start');
    for (let index = 0; true; index++) {
        const element = array[index];
        await sleep(30000);
    } // 等待

});