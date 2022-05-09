// 這是給"Discord APP"所使用的狀態系統，無用
// Root/Plugins/discord/status/rpc.js
module.exports = { rpc };
async function rpc() {
    const RPC = require('discord-rpc'); // 引入 discord-rpc
    const config = require('./../../../../Config');
    const clientId = `${config.clientID}`; // 剛剛複製的 Client ID
    const ipc = new RPC.Client({ transport: 'ipc' });
    ipc.on('ready', () => { // 登入後執行
        ipc.setActivity({ // 設定活動狀態
            details: '一個實用的機器人',
            state: '運作中',
            startTimestamp,
            largeImageKey: 'yzb',
            largeImageText: 'YZB',
            smallImageKey: 'server_icon',
            smallImageText: '柚子Youzi 大本營',
        });
    });
    await ipc.login({ clientId })
        .catch(err => {
            console.log(err);
        }); // 使用提供的 Client ID 登入
    /*
    const scopes = ['rpc', 'rpc.api', 'messages.read'];

    const client = new RPC.Client({ transport: 'websocket' });

    client.on('ready', () => {
      console.log('Logged in as', client.application.name);
      console.log('Authed for user', client.user.username);

      client.selectVoiceChannel('81384788862181376');
    });

    // Log in to RPC with client id
    client.login({ clientId, scopes });
    */

}