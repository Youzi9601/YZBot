const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "成員資訊",
    type: 2,
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {

        const user = interaction.guild.members.cache.get(interaction.targetId);


        // Bot type handler:
        const bot = {
            true: "是",
            false: "否",
        };

        // Acknowledgements handler:
        // L for Dyno developers
        const acknowledgements = {
            fetch: {
                user(userInput) {
                    let result;

                    try {
                        if (userInput.permissions.has(PermissionsBitField.ViewChannel)) result = "成員";
                        if (userInput.permissions.has(PermissionsBitField.KickMembers)) result = "版主";
                        if (userInput.permissions.has(PermissionsBitField.ManageServer)) result = "管理員";
                        if (userInput.permissions.has(PermissionsBitField.Administrator)) result = "管理者";
                        if (userInput.id === interaction.guild.ownerId) result = "所有者";

                    } catch (e) {
                        result = "成員";
                    }

                    return result;
                },
            },
        };

        // Finals:
        return await interaction.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${user.user.tag}的資訊：`)
                        .setThumbnail(user.displayAvatarURL(
                            {
                                dynamic: true,
                            },
                        ))
                        .addFields(
                            {
                                name: "全名",
                                value: `${user.user.tag}`,
                                inline: true,
                            },
                            {
                                name: "ID",
                                value: `\`${user.id}\``,
                                inline: true,
                            },
                            {
                                name: `共有 [${user.roles.cache.size - 1}] 個身分組`,
                                value: `${user.roles.cache.map((ROLE) => ROLE).join(' ').replace('@everyone', '') || "[沒有角色]"}`,
                                inline: true,
                            },
                            {
                                name: "加入伺服器於",
                                value: `<t:${Math.floor(user.joinedTimestamp / 1000)}>\n(<t:${Math.floor(user.joinedTimestamp / 1000)}:R>)`,
                                inline: true,
                            },
                            {
                                name: "加入 Discord 於",
                                value: `<t:${Math.floor(user.user.createdTimestamp / 1000)}>\n<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`,
                                inline: true,
                            },
                            {
                                name: "機器人？",
                                value: `${bot[user.user.bot]}`,
                                inline: true,
                            },
                            {
                                name: "於此伺服器中的身分",
                                value: `${acknowledgements.fetch.user(user)}`,
                            },
                        )
                        .setColor('Blue'),
                ],
                ephemeral: true,
            },
        );

    },
};
