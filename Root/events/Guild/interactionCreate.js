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

            client.console('Log', `${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 運行命令：${interaction}`);
            try {
                // 檢查命令相關許可
                if (
                    await require('./../../handlers/commandoptions/loadCommandOptions')(client, interaction, client.config, client.db, command, 'Normal')
                )
                    command.run(client, interaction, client.config, client.db);
                // 執行命令
            } catch (e) {
                client.console('Error', `執行命令時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.commandName);

            }
        }
        // Slash Autocomplete:
        if (interaction.isAutocomplete()) {
            const command = client.slash_commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(client, interaction, client.config, client.db);

            } catch (e) {
                client.console('Error', `執行命令時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);

            }
        }

        // Users:
        if (interaction.isUserContextMenuCommand()) {
            const command = client.contextmenu_user_commands.get(interaction.commandName);

            if (!command) return;

            client.console('Log', `${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 對著 ${interaction.targetUser.tag} 使用成員交互：${interaction.commandName}`);
            try {
                command.run(client, interaction, client.config, client.db);
            } catch (e) {
                client.console('Error', `執行成員應用時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.commandName);

            }
        }

        // Message:
        if (interaction.isMessageContextMenuCommand()) {
            const command = client.contextmenu_message_commands.get(interaction.commandName);

            if (!command) return;

            client.console('Log', `${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 對著 訊息(${interaction.targetMessage.id}): ${interaction.targetMessage.content} 使用訊息交互：${interaction.commandName}`);
            try {
                command.run(client, interaction, client.config, client.db);
            } catch (e) {
                client.console('Error', `執行訊息應用時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.commandName);

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
                client.console('Error', `執行模塊時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.customId);

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

            client.console('Log', `${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 使用按鈕：${interaction.customId}`);
            try {
                button.run(client, interaction, client.config, client.db);
            } catch (e) {
                client.console('Error', `執行按鈕時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.customId);

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

            client.console('Log', `${interaction.user.tag} 於 ${interaction.guild.name} (${interaction.guild.id}) #${interaction.channel.name} (${interaction.channel.id}) 使用選單：${interaction.customId} 選擇：${interaction.values.join(', ')}`);
            try {
                selectmenu.run(client, interaction, client.config, client.db);
            } catch (e) {
                client.console('Error', `執行選單時發生錯誤：`);
                client.console('Error', undefined, undefined, undefined, e);
                await reply_Error(client, interaction, interaction.customId);

            }
        }
    },

};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {String} commandName 命令名稱
 */
async function reply_Error(client, interaction, commandName = '無法得知此命令') {
    const embed = new EmbedBuilder()
        .setTitle('❌ 發生了錯誤')
        .setDescription(`這個命令 \`(${ commandName })\`發生了一些錯誤，無法正常運作。\n如果還是出現這個錯誤，請回報給機器人所有者！\n造成您的不便請見諒！`)
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) || interaction.user.defaultAvatarURL,
        })
        .setColor('#FF0000')
        .setTimestamp()
        .setFooter({
            text: client.user.tag,
            iconURL: client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL,
        });
    if (interaction.replied) {
        await interaction.editReply({ embeds:[embed], ephemeral:true, allowedMentions: { repliedUser: false } });
    } else {
        await interaction.reply({ embeds:[embed], ephemeral:true, allowedMentions: { repliedUser: false } });
    }
}