const {
	Client,
	Interaction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
} = require('discord.js');
const fs = require('fs-extra');

module.exports = {
	command: {
		name: 'help',
		description: '機器人的使用手冊',
	},
	clientPermissions: ['SEND_MESSAGES'],
	cooldown: 10000,
	/**
*
* @param {import('discord.js').Client} client
* @param {import('discord.js').CommandInteraction} interaction
* @param {*} container
*/
	async run(client, interaction, container) {

		const embed = new MessageEmbed()
			.setAuthor(
				{
					iconURL: `${ client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL }`,
					name: `${ client.user.username } 幫助介面`,
				})
			.setColor('RANDOM')
			.setDescription('請選擇一個類別！');

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('help_menu')
					.setPlaceholder('請選擇資訊類別')
					.addOptions([
						{
							label: '基本',
							description: '基本的命令',
							value: 'normal',
						},
						{
							label: '管理',
							description: '管理伺服器',
							value: 'manage',
						},
						{
							label: '音樂',
							description: '音樂系列命令',
							value: 'music',
						},
						{
							label: '趣味',
							description: '好玩的命令',
							value: 'fun',
						},
						{
							label: '設置功能',
							description: '設定一些有趣的東西?',
							value: 'setup',
						},
						{
							label: '控制',
							description: '控制機器人的活動',
							value: 'control',
						},
						{
							label: '開發者',
							description: '開發者所使用的命令',
							value: 'developers',
						},
						{
							label: '敬請期待！',
							description: '我們將會有更多的命令喔！',
							value: 'others',
						},
					]),
			);
		interaction.reply({ embeds: [embed], components: [row] });
		// Call the paginationEmbed method, first three arguments are required
		// timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
		// paginationEmbed(interaction, pages, buttonList, timeout);
		// There you go, now you have paged embeds

	},
};
