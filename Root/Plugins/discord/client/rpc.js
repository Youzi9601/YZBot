// 這是給"Discord APP"所使用的狀態系統，無用
// Root/Plugins/discord/status/rpc.js
module.exports = { rpc };
async function rpc() {
    const RPC = require('discord-rpc'); // 引入 discord-rpc
    const { config } = require('./../../../../bot');
    const clientId = `${config.clientID}`; // 剛剛複製的 Client ID
    const ipc = new RPC.Client({ transport: 'ipc' });
    // const Activity = config.beta.rpc.setActivity
    ipc.on('ready', () => { // 登入後執行
        console.info('>> RCP ready! <<');
        ipc.setActivity({ // 設定活動狀態
            // Activity,
            state: '開發中...',
            details: '一個實用的機器人',
            largeImageKey: 'yzb-5',
            largeImageText: 'YZB',
            smallImageKey: 'discord_icon_-_',
            smallImageText: '柚子 Youzi 大本營',
            startTimestamp: Date.now(),
        });

    });
    await ipc.login({ clientId })
        .catch(err => {
            console.info(err);
        }); // 使用提供的 Client ID 登入
    /*
    const scopes = ['rpc', 'rpc.api', 'messages.read'];

    const client = new RPC.Client({ transport: 'websocket' });

    client.on('ready', () => {
      console.info('Logged in as', client.application.name);
      console.info('Authed for user', client.user.username);

      client.selectVoiceChannel('81384788862181376');
    });

    // Log in to RPC with client id
    client.login({ clientId, scopes });
    */

}