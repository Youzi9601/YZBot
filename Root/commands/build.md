# 建造方式

#### 檔案名稱規範

請使用合宜的名稱來命名該命令名稱或是作用。
以下關鍵詞請注意： ( - 不可使用 ｜ + 建議使用 )

```diff
- 非英文的文字 - 避免檔案文字於其他地方無法正常生效
- 資料夾名稱結尾為 .xx (例如： *.js 的資料夾)
- **.func.js - 用於擴充的程式檔案(該檔案將會被忽略不會被註冊到)
- **/*-func/** - 用於擴充的程式資料夾(裡面的將會都被忽略不備註冊到)
- 過多的 - 和 _ 在文件名稱中(不建議超過3個以上)
+ 資料夾分類英文字母第一個字採大寫
+ 命令檔案英文採全小寫
```

#### ID 命名方式

`命令類別-名稱-ID`

```diff
cmu - Context Menu User
cmm - Context Menu Message
prx - Message Prefix Command
slash - Slash Command
func - function
```

#### 命令回應(Embed)的格式

顏色代碼 (Hex Code)

-   失敗/錯誤 0xf24e43
-   成功 0x41f097
-   警告 0xf6c42f
-   標準 0x0098d9

```js
const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder()
	.setFooter({
		text: client.user.username,
		iconURL: client.user.displayAvatarURL() || client.user.defaultAvatarURL,
	})
	.setTimestamp()
	.setColor("顏色");
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
		.toJSON(), // 這行特別重要，用於轉化為JSON
	type: "類別名稱",
	disabled: false, // 是否不使用此檔案
	anyClientPermission: [], // 需要機器人有任意一個權限
	returnAnyClientPermissions: true, //是否返此錯誤
	anyUserPermission: [], // 需要使用者有任意一個權限
	returnAnyUserPermissions: true, //
	clientPermissions: [], // 機器人需要這些權限
	returnClientPermissions: true,
	userPermissions: [], // 使用者需要這些權限
	returnUserPermissions: true, //
	requiredAnyRole: [], //
	returnRequiredAnyRole: true, //
	requiredRoles: [], //
	returnRequiredRoles: true, //
	onlyChannels: [], //
	returnOnlyChannels: true, //
	onlyGuilds: [], //
	returnOnlyGuilds: true, //
	onlyUsers: [], //
	returnOnlyUsers: true, //
	OnlyRunOnGuilds: false, // 限制只能於伺服器中使用該命令
	returnOnlyRunOnGuilds: true, //
	ownerOnly: false, // 限定機器人所有者使用
	returnOwnerOnly: true, //
	cooldown: 0, // 命令冷卻時間，（毫秒，1000ms = 1s ）
	returnCooldown: true, // 是否返回冷卻錯誤
	returnNoErrors: false, // 是否返回任何錯誤，true將會使任何錯誤都不會返回，並覆蓋掉 return 系列設定。

	/**
	 *
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 * @param {*} config
	 * @param {*} db
	 * @returns
	 */
	run: async (client, interaction, config, db) => {
		// 執行的內容
	},

	// 斜線命令獨有
	/**
	 *
	 * @param {*} client
	 * @param {import('discord.js').AutocompleteInteraction} interaction
	 * @param {*} config
	 * @param {*} db
	 */
	autocomplete: async (client, interaction, config, db) => {
		// 執行的內容
	},
};
```
