const { EmbedBuilder, Events } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Interaction} interaction
     * @returns
     */
    async execute(client, interaction) {

        // Slash:
        if (interaction.isChatInputCommand()) {
            const command = client.slash_commands.get(interaction.commandName);
            if (!command) return;

            try {
                // 檢查命令相關許可
                await require('./../../handlers/commandoptions/loadCommandOptions')(client, interaction, client.config, client.db, command);

                if (!interaction.replied)
                    command.run(client, interaction, client.config, client.db);
                // 執行命令
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行命令時發生錯誤：`);
                console.error(e);
            }
        }

        // Users:
        if (interaction.isUserContextMenuCommand()) {
            const command = client.contextmenu_user_commands.get(interaction.commandName);

            if (!command) return;

            try {
                command.run(client, interaction, client.config, client.db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行成員應用時發生錯誤：`);
                console.error(e);
            }
        }

        // Message:
        if (interaction.isMessageContextMenuCommand()) {
            const command = client.contextmenu_message_commands.get(interaction.commandName);

            if (!command) return;

            try {
                command.run(client, interaction, client.config, client.db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行訊息應用時發生錯誤：`);
                console.error(e);
            }
        }

        // Modals:
        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);

            if (!modal) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('出了點問題……模態處理程序中可能未定義模態 ID。')
                            .setColor('Red'),
                    ],
                    ephemeral: true,
                });
            }

            try {
                modal.run(client, interaction, client.config, client. db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行模塊時發生錯誤：`);
                console.error(e);
            }
        }

        // Buttons:
        if (interaction.isButton()) {
            const button = client.button_commands.get(interaction.customId);

            if (!button) {
                // 等待並檢查是否有其他內建按鈕執行過了
                await wait(1000);
                if (interaction.isRepliable()) return;
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('出了點問題……按鈕處理程序中可能未定義的 ID。')
                            .setColor('Red'),
                    ],
                    ephemeral: true,
                });
            }

            try {
                button.run(client, interaction, client.config, client.db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行按鈕時發生錯誤：`);
                console.error(e);
            }
        }

        // Buttons:
        if (interaction.isAnySelectMenu()) {
            const selectmenu = client.selectmenu_commands.get(interaction.customId);

            if (!selectmenu) {
                // 等待並檢查是否有其他內建按鈕執行過了
                await wait(1000);
                if (interaction.isRepliable()) return;
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('出了點問題……選單處理程序中可能未定義的 ID。')
                            .setColor('Red'),
                    ],
                    ephemeral: true,
                });
            }

            try {
                selectmenu.run(client, interaction, client.config, client.db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行選單時發生錯誤：`);
                console.error(e);
            }
        }
    },

};