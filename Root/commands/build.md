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
