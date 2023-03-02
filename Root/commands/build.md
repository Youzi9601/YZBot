# 建造方式

#### ID 命名方式

`命令類別-名稱-ID`

```diff
cmu - Context Menu User
cmm - Context Menu Message
prx - Message Prefix Command
slash - Slash Command
```

#### 命令檔案的格式

斜線命令

```js
const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("CommandName")
    .setDescription("命令的敘述")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .toJSON(),
  type: "類別名稱",
  disabled: false, // 是否不使用此檔案
  anyClientPermission: [], // 需要機器人有任意一個權限
  returnAnyClientPermissions: true, //是否返此錯誤
  anyUserPermission: [],// 需要使用者有任意一個權限
  returnAnyUserPermissions: true,//
  clientPermissions: [], // 機器人需要這些權限
  returnClientPermissions:true,
  userPermissions: [], // 使用者需要這些權限
  returnUserPermissions:true,//
  requiredAnyRole: [], // 
  returnRequiredAnyRole:true,//
  requiredRoles: [],// 
  returnRequiredRoles:true,//
  onlyChannels: [],// 
  returnOnlyChannels:true,//
  onlyGuilds: [],// 
  returnOnlyGuilds:true,//
  onlyUsers: [], // 
  returnOnlyUsers:true,//
  OnlyRunOnGuilds: false, // 限制只能於伺服器中使用該命令
  returnOnlyRunOnGuilds:true,//
  ownerOnly: false,// 限定機器人所有者使用
  returnOwnerOnly: true,//
  cooldown: 0, // 命令冷卻時間，（毫秒，1000ms = 1s ）
  returnCooldown: true, // 是否返回冷卻錯誤
  returnNoErrors: false,// 是否返回任何錯誤，true將會使任何錯誤都不會返回，並覆蓋掉 return 系列設定。
  /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {*} config
   * @param {*} db
   * @returns
   */
  run: async (client, interaction, config, db) => {
    // 執行的內容
  },
};
```
