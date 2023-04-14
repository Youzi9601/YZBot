## 未來網頁的架構

### 檔案
```markdown
- /public
    - /css
        - style.css
    - /js
        - script.js
    - /html
        - index.html
- /views
    - index.ejs
    - layout.ejs
- /routes
    - index.js

```

### 網頁路徑 ( - 為網頁 | + 為接收系統 | * 為分類 )
```markdown
- /home 首頁

    * 機器人相關
    - /commands

    * 政策相關
    - /terms
    - /privacy-policy

- /dashboard 控制台

    * 登入系統
    - /login
        - /discord 轉到機器人驗證
    + /logout 登出，並跳轉到 /dahsboard/login
    - /queue 排隊

    * 內部系統
    - /:GuildID 伺服器ID
        - /(#各式插件)
    - /admin 管理員後台

+ /auth 驗證系統

    * Discord相關驗證
    + /discord-auth 用於驗證帳號登入
    + /guild-oauth 用於回傳該使用者的伺服器資料

+ /webhook 網路接收

    + /vote 投票系統
        + /dst
```