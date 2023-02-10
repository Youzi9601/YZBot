const express = require('express');
const session = require('express-session')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { request } = require('undici');

const { QuickDB } = require('quick.db')
const client_db = new QuickDB().table('client')

const config = require('../Config');
/**
 * 網頁架構備忘錄
 * 首頁
 * |- 介紹與幫助 home
 * |- 命令 commands
 * |- 伺服器控制台 dashboard
 * |- |- 登入畫面 login
 * |- |- 伺服器列表
 * |- |- |- 伺服器ID
 * |- |- |- |- 該伺服器的控制選項
 * |- |- |- 個人帳號
 * |- 開發人員後台
 */
/**
 * 網頁
 * @param {import('discord.js').Clienconfig.web.port t} client 客戶端
 */
module.exports = async (client) => {
    const host = `${ config.web.domain }:${ config.web.port }`

    /**
     * @INFO 基本設定&取得資料
     */
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/', express.static(__dirname + '/webs/'))

    app.use(session({
        secret: `YZB-DiscordUser`,
        name: 'user', // optional
        saveUninitialized: false,
        resave: true,
    }));

    // 取得連線的訪客
    const uniqueVisitor = new Set();
    const inqueueVisiter = new Set();
    // 執行每N分鐘刷新當前有紀錄的訪客一次
    setInterval(function() {
        uniqueVisitor.clear()
    }, (Number(config.web.maxVisitor.minute) * 60 * 1000));
    // 每當有任何與伺服器連線的事件
    app.use((req, res, next) => {
        // 網頁流量管制 ( 如果不在訪客名單中 且 當前人數超過指定人數 )
        if (
            uniqueVisitor.size >= Number(config.web.maxVisitor.count)
            && !uniqueVisitor.has(req.ip)
        ) {
            // 執行排隊
            inqueueVisiter.add(req.ip)
            // 取得等待列表中的項目並回傳
            let array = Array.from(inqueueVisiter);
            let index = array.indexOf(req.ip);

            // 如果他的排隊號碼是第一個
            if (index == 0) {
                uniqueVisitor.add(req.ip);
                return res.redirect('/dashboard/login')
            }
            // 非第一個且不在queue
            if (!req.query.queue) {
                return res.redirect('/dashboard/queue?queue=' + `${(index + 1)}`)
            }

        } else {
            // 執行紀錄並繼續
            uniqueVisitor.add(req.ip);
            next();
        }
    });


    // 架設資料庫
    app
    /**
     * @INFO 網頁
     */
    // #region 網頁
    // 首頁
        .get('/', (req, res) => {
            res.redirect('./home')
        })
        .get('/home', async (req, res) => {
            const servers = await client_db.get('servers')
            const users = await client_db.get('users')
            const channels = await client_db.get('channels')
            await setCookie('clientcount',
                {
                    servers: servers,
                    users: users,
                    channels: channels,
                },
                1)
            res.sendFile('webs/html/index.html', { root: __dirname })

            async function setCookie(cname, cvalue, exdays) {
                res.cookie(cname, JSON.stringify(cvalue), {
                    expires: new Date(Date.now() + (exdays * 24 * 60 * 60 * 1000)),
                    path: '/',
                    encode: String,
                    maxAge: (exdays * 60 * 60 * 24),
                });
            }
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
            res.sendFile('webs/html/pages/commands.html', { root: __dirname })
        })
    // 隱私政策
        .get('/home/privacy-policy', (req, res) => {
            res.sendFile('webs/html/pages/privacy-policy.html', { root: __dirname })
        })
    // 服務條款
        .get('/home/terms', (req, res) => {
            res.sendFile('webs/html/pages/terms-of-service.html', { root: __dirname })
        })
    // 控制台 - 登入頁面
        .get('/dashboard/login', (req, res) => {
            res.sendFile('webs/html/login.html', { root: __dirname })
        })
        .get('/dashboard/login/discord', (req, res) => {
            res.redirect(config.web.links.discordAuthLoginUrl)
        })
        .get('/dashboard/logout', (req, res) => {
            res.clearCookie()
            req.session.cookie.expires = new Date(Date.now() + 1000);
            req.session.cookie.maxAge = 1000;
            req.session.user = null
            req.session.save()
            res.redirect('/home')
        })
        .get('/dashboard/queue', (req, res) => {
            // 執行排隊
            return res.sendFile('webs/html/pages/overloaded.html', { root: __dirname })

        })

    // 設定 - 控制台
        .get('/dashboard', (req, res) => {
            if (!req.session.user) {
                return res.redirect('/dashboard/login')
            }
            res.sendFile('webs/html/servers/dashboard.html', { root: __dirname });
        })
        .get('/dashboard/' + ':GuildID', (req, res) => {
            if (!req.session.user) {
                return res.redirect('/dashboard/login')
            }
            // TODO: 需要將dashboard的session內存入Discord oauth token，並於機器人執行中添加一個資料庫存放 token (雖然無效，但是那是隨機的)，用來避免駭客駭入Web後台。
            const guildID = req.params.GuildID;
            res.send(`這是${guildID}伺服器的控制面板。目前還在架設中...`)
            // res.sendFile('webs/html/servers/0-guild.html', { root: __dirname });
        })
    // 管理員後台
        .get('/dashboard/admin', (req, res) => {
            res.send('這是ADMIN的管理後台...')
        // res.sendFile('webs/html/servers.html', { root: __dirname });
        })
    // #endregion 網頁
    /**
     *  @INFO API 設定
     */
    // #region API
    // discord auth 的認證用畫面
    app
        .get('/auth/discord-auth', async (req, res) => {
            // 等待加入，使用passport npm package
            // req.login()
            const { code } = req.query;
            // console.log(req.body)

            let userdata = {};
            let userGuilddata = [];

            if (code) {
                try {
                    const user_tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                        method: 'POST',
                        body: new URLSearchParams({
                            client_id: config.bot.clientID,
                            client_secret: config.bot.clientSECRET,
                            code,
                            grant_type: 'authorization_code',
                            redirect_uri: `${host}/auth/discord-auth`,
                            scope: 'identify',
                        }).toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    });

                    const user_oauthData = await user_tokenResponseData.body.json();

                    // 取得使用者資料
                    const userResult = await request('https://discord.com/api/users/@me', {
                        headers: {
                            authorization: `${ user_oauthData.token_type } ${ user_oauthData.access_token }`,
                        },
                    });
                    const userGuildsResult = await request('https://discord.com/api/users/@me/guilds', {
                        headers: {
                            authorization: `${ user_oauthData.token_type } ${ user_oauthData.access_token }`,
                        },
                    })
                    // 取得機器人資料
                    const clientguilds = await client.shard
                        .fetchClientValues('guilds.cache')
                        .then(guilds => {
                            return guilds
                        })
                        .catch(e => {
                            console.error(`[#${ client.shard.ids }]  網站擷取機器人所有伺服器時發生了錯誤：`)
                            console.error(e)
                        });
                    const guildIds = [].concat(...clientguilds.map(guildArray => guildArray.map(guild => ({ id: guild.id }))));

                    // 處理資料

                    userdata = await userResult.body.json()
                    req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000);
                    req.session.cookie.maxAge = 60 * 60 * 1000;
                    req.session.user = userdata.id
                    req.session.access_token = user_oauthData.access_token
                    req.session.save()

                    userGuilddata = await userGuildsResult.body.json()

                    // 處理資料(特殊標籤&要求權限)
                    userGuilddata = userGuilddata.filter(guild => (
                        guild.owner == true ||
                        hasPermission(guild.permissions, 8) ||
                        hasPermission(guild.permissions, 32)))
                        .map(guild => (
                            {
                                id: guild.id,
                                name: guild.name,
                                permissions: guild.permissions,
                                icon: guild.icon,
                                owner: guild.owner,
                                position: (guild.owner ? '所有者' : (hasPermission(guild.permissions, 8) ? '管理者' : '管理員')),
                                botincludes: (guildIds.some(g => g.id === guild.id) ? 'true' : 'false'),
                                url: (guildIds.some(g => g.id === guild.id) ? undefined : config.web.links.discordbotinvite),
                            }))
                    userGuilddata.sort((a, b) => (a.botincludes === 'true' ? 0 : 1) - (b.botincludes === 'true' ? 0 : 1));
                } catch (error) {
                // NOTE: 未經授權的令牌不會拋出錯誤
                // tokenResponseData.statusCode will be 401
                    console.error(`[#${client.shard.ids}]  執行網站時發生錯誤：`)
                    console.error(error);
                    return res.redirect('./login?err=true')
                }
                // 傳送資料並返回dashboard
                // 儲存
                // res.setHeader('userguilds', `userGuilddata=${encodeURIComponent(JSON.stringify(userGuilddata))};`);
                // console.log(userdata)
                // console.log(userGuilddata)
                // await setCookie('userdata', userdata, 2)
                return res.send(`
    <html>
      <head>
        <script>
          // Save data to local storage
          sessionStorage.setItem('userdata', JSON.stringify(${JSON.stringify(userdata)}));
          // let data = JSON.parse(sessionStorage.getItem('userdata'));
          sessionStorage.setItem('userguilds', JSON.stringify(${JSON.stringify(userGuilddata)}));
          // let data = JSON.parse(sessionStorage.getItem('userguilds'));
         
          // console.log(data)
          setTimeout(function() {
        window.location.href = "/dashboard";
      }, 100);
          </script>
      </head>
      <body>
        YZB 處理中...
      </body>
    </html>
  `);
            // 轉網址
            } else {
                return res.redirect('/dashboard/login?err=true')
            }

            // 處離傳回用資料
            function hasPermission(permissions, permissionFlag) {
                return (permissions & permissionFlag) === permissionFlag;
            }

        })
    // discord 伺服器加入機器人
        .get('/auth/guild-oauth', async (req, res) => {
            const { code } = req.query;
            // console.log(req.body)
            const guildid = req.query.guild_id;
            if (code) {
                // 傳送資料並返回dashboard
                // 儲存
                // res.setHeader('userguilds', `userGuilddata=${encodeURIComponent(JSON.stringify(userGuilddata))};`);
                // console.log(userdata)
                // console.log(userGuilddata)
                // await setCookie('userdata', userdata, 2)
                return res.redirect(`/dashboard/${guildid}`)
            // 轉網址
            } else {
                return res.redirect('/dashboard?err=true')
            }
        })
        .post('/auth/login', async (req, res) => {
        // console.log(req.body)

            /*
        if (req.body) {
            const { userToken } = req.body;
            res.sendFile('webs/html/admin.html', { root: __dirname })
        }
        */

        })

    // 處理404 (最後放置)
    app.get('*', (req, res) => {
        return res.status(404).sendFile('webs/html/pages/404.html', { root: __dirname })
    });


    // #endregion API
    // 監聽&上線
    app.listen(config.web.port, () => console.log(`[#${client.shard.ids}]  網站監聽 ${host}`));

}