const { EmbedBuilder } = require("discord.js");

module.exports = {
	id: "myModal",
	run: async (client, interaction, config, db) => {

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription('模式正在工作！這是您輸入的內容：' + interaction.fields.getTextInputValue('something')),
			],
			ephemeral: true,
		});

	},
};
