const express = require('express');
const { request } = require('undici');
const { QuickDB } = require('quick.db')
const config = require('./Config');
/**
 * 網頁架構備忘錄
 * 首頁
 * |- 介紹與幫助 home
 * |- 命令 commands
 * |- 登入畫面 login
 * |- |- 伺服器控制台 dashboard (伺服器列表)
 * |- |- |- 伺服器ID
 * |- |- |- |- 該伺服器的控制選項
 * |- |- |- 個人帳號
 * |- 開發人員後台
 */
/**
 * 基本設定&取得資料
 */
const app = express();
app.use('/', express.static(__dirname + '/Root/webs/'))

// 架設資料庫
/**
 * 網頁
 */
// #region 網頁
// 首頁
    .get('/', (req, res) => {
        res.sendFile('Root/webs/html/index.html', { root: __dirname })
    })

// 登入頁面
    .get('/login', (req, res) => {
        res.sendFile('Root/webs/html/login.html', { root: __dirname })
    })

// 控制台
    .get('/dashboard', (req, res) => {
        res.send('目前還在架設中...')
        // res.sendFile('Root/webs/html/servers.html', { root: __dirname });
    })
// 控制台
    .get('/admin', (req, res) => {
        res.send('這是ADMIN的管理後台...')
        // res.sendFile('Root/webs/html/servers.html', { root: __dirname });
    })
// #endregion 網頁
/**
 *  API 設定
 */
// #region API
// discord auth 的認證用畫面
app.get('/discord-auth', async ({ query }, response) => {
    const { code } = query;

    if (code) {
        try {
            const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: config.bot.clientID,
                    client_secret: config.bot.clientSECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `http://localhost:${config.web.port}/discord-auth`,
                    scope: 'identify',
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const oauthData = await tokenResponseData.body.json();

            const userResult = await request('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });

            console.log(await userResult.body.json());
        } catch (error) {
            // NOTE: 未經授權的令牌不會拋出錯誤
            // tokenResponseData.statusCode will be 401
            console.error(error);
            return response.redirect('/login')

        }
    }
    // 轉網址
    return response.redirect('/dashboard')
})
// 登入
app.post('./login', (req, res) => {
    const { userToken } = req.body;
    res.sendFile('Root/webs/html/admin.html', { root: __dirname })
});
// #endregion API
// 監聽&上線
app.listen(config.web.port, () => console.log(`應用程序監聽 http://localhost:${config.web.port}`));