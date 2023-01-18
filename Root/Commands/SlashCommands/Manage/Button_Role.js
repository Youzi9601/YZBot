const {
	//
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { config } = require('../../../../bot');

module.exports = {
	command:
        new SlashCommandBuilder()
        	.setName('button')
        	.setDescription('按鈕')

        // #region chat
        	.addSubcommandGroup(g =>
        		g
        			.setName('role')
        			.setDescription('按鈕身分組')
        		// #region send
        			.addSubcommand(c =>
        				c
        					.setName('create')
        					.setDescription('創建按鈕身分組')
        					.addRoleOption(r =>
        						r
        							.setName('role1')
        							.setDescription('身分組1')
        							.setRequired(true),

        					)
        					.addRoleOption(r =>
        						r
        							.setName('role2')
        							.setDescription('身分組2')
        							.setRequired(false),

        					)
        					.addRoleOption(r =>
        						r
        							.setName('role3')
        							.setDescription('身分組3')
        							.setRequired(false),

        					)
        					.addRoleOption(r =>
        						r
        							.setName('role4')
        							.setDescription('身分組4')
        							.setRequired(false),

        					)
        					.addRoleOption(r =>
        						r
        							.setName('role5')
        							.setDescription('身分組5')
        							.setRequired(false),

        					)
        					.addStringOption(s =>
        						s
        							.setName('contents')
        							.setDescription('純文字')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('title')
        							.setDescription('標題')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('title_url')
        							.setDescription('超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('description')
        							.setDescription('內文')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('color')
        							.setDescription('顏色 | 白FFFFFF、黑000000、紅FF0000、綠00FF00、藍0000FF')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_name')
        							.setDescription('作者')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_icon')
        							.setDescription('圖標(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_url')
        							.setDescription('超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('thumbnail')
        							.setDescription('圖片(右側)，使用超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('image')
        							.setDescription('圖片(下方)，使用超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('fields')
        							.setDescription('以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('timestamp')
        							.setDescription('啟用時間? (預設為否)')
        							.setRequired(false)
        							.setChoices(
        								{
        									name: 'True',
        									name_localizations: {
        										'zh-TW': '是',
        									},
        									value: 'true',

        								},
        								{
        									name: 'False',
        									name_localizations: {
        										'zh-TW': '否',
        									},
        									value: 'false',
        								},
        							),
        					)
        					.addStringOption(s =>
        						s
        							.setName('footer_text')
        							.setDescription('底部文字')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('footer_icon')
        							.setDescription('底部頭像')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('reply_id')
        							.setDescription('回覆的訊息ID')
        							.setRequired(false),
        					),

        			)
        		// #endregion send
        		// #region edit
        			.addSubcommand(c =>
        				c
        					.setName('edit')
        					.setDescription('編輯按鈕身分組的訊息')
        					.addStringOption(s =>
        						s
        							.setName('message_id')
        							.setDescription('訊息的ID')
        							.setRequired(true),
        					)
        					.addStringOption(s =>
        						s
        							.setName('contents')
        							.setDescription('純文字')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('title')
        							.setDescription('標題')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('title_url')
        							.setDescription('超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('description')
        							.setDescription('內文')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('color')
        							.setDescription('顏色 | 白FFFFFF、黑000000、紅FF0000、綠00FF00、藍0000FF')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_name')
        							.setDescription('作者')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_icon')
        							.setDescription('圖標(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('author_url')
        							.setDescription('超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('thumbnail')
        							.setDescription('圖片(右側)，使用超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('image')
        							.setDescription('圖片(下方)，使用超連結(限定 http(s):// )')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('fields')
        							.setDescription('以","分開項目，並用";"分開每個field(最後一個不需要加上";")。表示法： name(小標題),value(內容),inline(true/false);...')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('timestamp')
        							.setDescription('啟用時間? (預設為否)')
        							.setRequired(false)
        							.setChoices(
        								{
        									name: 'True',
        									name_localizations: {
        										'zh-TW': '是',
        									},
        									value: 'true',

        								},
        								{
        									name: 'False',
        									name_localizations: {
        										'zh-TW': '否',
        									},
        									value: 'false',
        								},
        							),
        					)
        					.addStringOption(s =>
        						s
        							.setName('footer_text')
        							.setDescription('底部文字')
        							.setRequired(false),
        					)
        					.addStringOption(s =>
        						s
        							.setName('footer_icon')
        							.setDescription('底部頭像')
        							.setRequired(false),
        					),

        			),
        		// #endregion edit
        	)
        // #endregion chat
        	.toJSON(), // 必要的，格式化
	clientPermissions: ['ADMINISTRATOR'],
	userPermissions: ['ADMINISTRATOR'],
	/**
     *
     * @param {import('discord.js').Client} client 機器人
     * @param {CommandInteraction} interaction
     * @param {container} container
     */
	async run(client, interaction, container) {
		// #region 命令
		// 取得子指令
		const subcommand = interaction.options.getSubcommand();
		let subcommandGroup = '';
		try {
			subcommandGroup = interaction.options.getSubcommandGroup();
		}
		catch (error) {
			// 沒有群組指令
		}

		// 非群組指令
		if (!subcommandGroup) {
			// none
		}
		// 群組指令
		else if (subcommandGroup == 'role') {
			await interaction.deferReply({ ephemeral: true });
			// #region  取得基本命令內容
			// 取得指令內容
			const channel =
                    client.channels.cache.get(
                    	interaction.options.getString('channel_id'),
                    ) || interaction.channel;
			const content = interaction.options.getString('contents') || undefined;
			const embed = {};
			// EMBED
			// main
			const embed_title = interaction.options.getString('title') || undefined;
			if (embed_title) {
				embed.title = embed_title.replace(/\\n/g, '\n');
			}
			const embed_description =
                    interaction.options.getString('description') || undefined;
			if (embed_description) {
				embed.description = embed_description.replace(/\\n/g, '\n');
			}
			const embed_title_url =
                    interaction.options.getString('title_url') || undefined;
			if (embed_title_url) {
				embed.url = embed_title_url;
			}
			// author
			const embed_author_name =
                    interaction.options.getString('author_name') || undefined;
			const embed_author_icon =
                    interaction.options.getString('author_icon') || undefined;
			const embed_author_url =
                    interaction.options.getString('author_url') || undefined;
			if (embed_author_name || embed_author_url || embed_author_icon) {
				embed.author = {};
				if (embed_author_name) {
					embed.author.name = embed_author_name;
				}
				if (embed_author_icon) {
					embed.author.icon = embed_author_icon;
				}
				if (embed_author_url) {
					embed.author.url = embed_author_url;
				}
			}
			// thumbnail
			const embed_thumbnail =
                    interaction.options.getString('thumbnail') || undefined;
			if (embed_thumbnail) {
				embed.thumbnail = {};
				embed.thumbnail.url = embed_thumbnail;
			}
			// image
			const embed_image = interaction.options.getString('image') || undefined;
			if (embed_image) {
				embed.image = {};
				embed.image.url = embed_image;
			}
			// footer

			const embed_footer_text =
                    interaction.options.getString('footer_text') || undefined;
			const embed_footer_icon =
                    interaction.options.getString('footer_icon') || undefined;
			if (embed_footer_icon || embed_footer_text) {
				embed.footer = {};
				if (embed_footer_text) {
					embed.footer.text = embed_footer_text;
				}
				if (embed_footer_icon) {
					embed.footer.icon_url = embed_footer_icon;
				}
			}
			// fields
			const embed_fields =
                    interaction.options.getString('fields') || undefined;
			if (embed_fields) {
				// 分開每個部件
				const fields = embed_fields.split(';');
				const fields_return = [];
				// 整理每個部件的項目
				fields.forEach((field) => {
					const obj = field.split(',');
					fields_return.push({
						name: obj[0],
						value: obj[1],
						inline: obj[2] || false,
					});
				});
				embed.fields = [fields_return];
			}

			// 取得訊息內容
			const msg = {};
			if (content) {
				msg.content = content.replace(/\\n/g, '\n\u200b');
			}

			if (
				embed.title ||
                    embed.description ||
                    embed.footer ||
                    embed.image ||
                    embed.thumbnail ||
                    embed.fields
			) {
				// timestamp & color
				const embed_color = interaction.options.getString('color') || '000000';
				if (embed_color) {
					embed.color = '0x' + embed_color;
				}
				const embed_timestamp =
                        interaction.options.getString('timestamp') || false;
				if (embed_timestamp == true) {
					embed.timestamp = new Date();
				}
				else {
					// 不新增
				}
				// 設定
				msg.embeds = [embed];
			}
			// #endregion 取得命令內容

			if (subcommand == 'create') {

				/**
                     * 執行創建身分組內容
                     */
				// #region roles
				const roles_button = [];

				const roles_each = ['role1', 'role2', 'role3', 'role4', 'role5'];
				roles_each.forEach(r => {
					const role = interaction.options.getRole(r) || undefined;
					if (role) {
						const button = new MessageButton()
							.setLabel('@' + role.name + '')
							.setStyle('PRIMARY')
							.setCustomId('button_role_' + r)
							.setDisabled(false);
						roles_button.push(button);

					}
				});

				// 合併Components
				const row = new MessageActionRow()
					.addComponents(roles_button);
				// #endregion roles

				msg.components = [row];

				//

				const reply_id = interaction.options.getString('reply_id');
				if (reply_id) {
					channel.messages.fetch({ around: reply_id, limit: 1 })
						.then(message => {
							const fetchedMsg = message.first();
							fetchedMsg.reply(msg);
							interaction.editReply({
								content: '已經成功發送指定訊息',
							});
						}).catch((error) => {
							console.error(error);
							interaction.editReply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${ reply_id } 的訊息 ...` });
							return;
						});
				}

				else {
					try {
						await channel.send(msg);
					}
					catch (error) {
						console.error(error);
						await interaction.editReply({ content: `啊喔...發生了錯誤：無法發送訊息...\n\`\`\`js\n${ error }\`\`\`` });
						return;
					}
				}
				await interaction.editReply({
					content: '已經成功發送指定訊息',
					ephemeral: true,
				});
			}
			else if (subcommand == 'edit') {
				channel.messages.fetch({ around: interaction.options.getString('message_id'), limit: 1 })
					.then(message => {
						const fetchedMsg = message.first();
						fetchedMsg.edit(msg);
						// console.info(msg);
						// console.info(fetchedMsg.content);
						interaction.editReply({
							content: '已經成功編輯指定訊息',
							ephemeral: true,
						});
					}).catch((error) => {
						console.error(error);
						interaction.editReply({ content: `啊喔...發生了錯誤：找不到訊息ID為 ${ interaction.options.getString('message_id') } 的訊息 ...` });
						return;
					});
			}

		}
		// #endregion
	},
};
