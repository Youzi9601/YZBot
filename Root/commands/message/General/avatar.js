const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "取得頭像",
    type: 2,
    run: async (client, interaction, config, db) => {

        const user = interaction.guild.members.cache.get(interaction.targetId);

        // Finals:
        return await interaction.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${ user.user.tag }的頭像：`)
                        .setDescription(
                            `[[點我下載]](${ user.displayAvatarURL(
                                {
                                    dynamic: true,
                                },
                            ) })`,
                        )
                        .setImage(user.displayAvatarURL(
                            {
                                dynamic: true,
                            },
                        )),
                ],
                ephemeral: true,
            },
        );

    },
};
