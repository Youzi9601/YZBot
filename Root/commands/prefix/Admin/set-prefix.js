const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "prefix",
        description: "設置公會的前綴。",
        usage: "prefix [新前綴]",
    },
    permissions: ['Administrator'],
    owner: false,
    disabled: true,
    run: async (client, message, args, prefix, config, db) => {

        if (!args[0]) {
            return await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("缺少參數")
                    .setDescription("請提供一個新的前綴！"),
            ] });
        }

        if (args[0].length > 5) {
            return await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("缺少參數")
                    .setDescription("抱歉，新前綴的長度不能超過 5 個字符！"),
            ] });
        }

        const newPrefix = await db.set(`guild_prefix_${message.guild.id}`, args[0]);

        const finalEmbed = new EmbedBuilder()
            .setTitle("成功！")
            .setDescription(`此伺服器的新前綴： \`${newPrefix}\`.`)
            .setColor("Green");

        return await message.reply({ embeds: [finalEmbed] });

    },
};
