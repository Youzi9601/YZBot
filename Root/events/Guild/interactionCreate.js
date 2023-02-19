const { EmbedBuilder, Events } = require("discord.js");
const config = require("./../../../Config");
const { QuickDB } = require("quick.db");
const wait = require('node:timers/promises').setTimeout;
const db = new QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {

        // Slash:
        if (interaction.isChatInputCommand()) {
            const command = client.slash_commands.get(interaction.commandName);
            await require('./../../handlers/commandoptions/loadCommandOptions')(client, interaction, config, db, command);

            if (!command) return;

            try {
                command.run(client, interaction, config, db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行命令時發生錯誤：`)
                console.error(e)
            }
        }

        // Users:
        if (interaction.isUserContextMenuCommand()) {
            const command = client.user_commands.get(interaction.commandName);

            if (!command) return;

            try {
                command.run(client, interaction, config, db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行成員應用時發生錯誤：`)
                console.error(e)
            }
        }

        // Message:
        if (interaction.isMessageContextMenuCommand()) {
            const command = client.message_commands.get(interaction.commandName);

            if (!command) return;

            try {
                command.run(client, interaction, config, db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行訊息應用時發生錯誤：`)
                console.error(e)
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
                modal.run(client, interaction, config, db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行模塊時發生錯誤：`)
                console.error(e)
            }
        }

        // Buttons:
        if (interaction.isButton()) {
            const button = client.button_commands.get(interaction.customId);

            if (!button) {
                // 等待並檢查是否有其他內建按鈕執行過了
                await wait(1000)
                if (interaction.isRepliable()) return
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
                button.run(client, interaction, config, db);
            } catch (e) {
                console.error(`[#${ client.shard.ids }]  執行按鈕時發生錯誤：`)
                console.error(e)
            }
        }
    },

}