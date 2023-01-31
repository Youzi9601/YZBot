/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require("body-parser");
const { request } = require('undici');

const { QuickDB } = require('quick.db')
const db = new QuickDB().table('login')

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
     * @INFO 基本設定&取得資料
     */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/Root/webs/'))

// 架設資料庫
    /**
     * @INFO 網頁
     */
    // #region 網頁
    // 首頁
    .get('/', (req, res) => {
        res.redirect('./home')
    })
    .get('/home', (req, res) => {
        res.sendFile('Root/webs/html/index.html', { root: __dirname })
    })
    // 首頁的快速導覽
    .get('/home/github', (req, res) => {
        res.redirect(config.web.links.github)
    })
    .get('/home/discord', (req, res) => {
        res.redirect(config.web.links.discord)
    })
    .get('/home/invite_bot', (req, res) => {
        res.redirect(config.web.links.discordbotinvite)
    })
    // 指令頁面
    .get('/home/commands', (req, res) => {
        res.sendFile('Root/webs/html/pages/commands.html', { root: __dirname })
    })

    // 登入頁面
    .get('/login', (req, res) => {
        res.sendFile('Root/webs/html/login.html', { root: __dirname })
    })
    .get('/login/discord', (req, res) => {
        res.redirect(config.web.links.discordAuthLoginUrl)
    })

    // 控制台
    .get('/dashboard', (req, res) => {
        res.sendFile('Root/webs/html/servers/dashboard.html', { root: __dirname });
    })
    .get('/dashboard/' + ':GuildID', (req, res) => {
        res.send('目前還在架設中...')
        // res.sendFile('Root/webs/html/servers.html', { root: __dirname });
    })
    // 管理員後台
    .get('/admin', (req, res) => {
        res.send('這是ADMIN的管理後台...')
        // res.sendFile('Root/webs/html/servers.html', { root: __dirname });
    })
    // #endregion 網頁
    /**
     *  @INFO API 設定
     */
// #region API
// discord auth 的認證用畫面
app
    .get('/discord-auth', async ({ query }, res) => {
        const { code } = query;
        let userdata;

        if (code) {
            try {
                const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: config.bot.clientID,
                        client_secret: config.bot.clientSECRET,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: `${ config.web.domain }:${ config.web.port }/discord-auth`,
                        scope: 'identify',
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const oauthData = await tokenResponseData.body.json();

                const userResult = await request('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${ oauthData.token_type } ${ oauthData.access_token }`,
                    },
                });

                userdata = await userResult.body.json()
                console.log(oauthData.guild)
                console.log(userdata);
            } catch (error) {
                // NOTE: 未經授權的令牌不會拋出錯誤
                // tokenResponseData.statusCode will be 401
                console.error(error);
                return res.redirect('/login?err=true')

            }
        }

        // 處離傳回用資料
        function setCookie(cname, cvalue, exdays) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            res.cookie(cname, JSON.stringify(cvalue), { maxAge:exdays });
        }
        setCookie('userdata', userdata, 30)
        // 轉網址
        return res.redirect('/dashboard')
    })
    // discord 伺服器加入機器人
    .get('/guild-oauth', async ({ query }, res) => {
        return res.redirect(`/dashboard/` + '伺服器ID')
    })
    .post('/login', async (req, res) => {
        console.log(req.body)

        /*
        if (req.body) {
            const { userToken } = req.body;
            res.sendFile('Root/webs/html/admin.html', { root: __dirname })
        }
        */

    })
// #endregion API
// 監聽&上線
app.listen(config.web.port, () => console.log(`應用程序監聽 ${ config.web.domain }:${ config.web.port }`));