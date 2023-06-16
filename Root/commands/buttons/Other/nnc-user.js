const { EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');


module.exports = {
    regex: /^nnc-/,
    disabled: true,
    /**
     *
     * @param {import('./../../../bot').client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {import("./../../Config")} config
     * @param {import("quick.db").QuickDB} db
     */
    run: async (client, interaction, config, db) => {
        await interaction.deferReply({ ephemeral: true });

        const translations = client.language_data(interaction.locale, 'plugins/client/nicknamechat');

        const id = interaction.customId;
        /**
         * 格式：
         * nnc-匿名者ID-messageID
         */

        const [_pfx, userID, messageID] = id.split('-');
        const ncc_member = interaction.guild.members.cache.get(userID);
        const member = interaction.member;
        const message = interaction.channel.messages.cache.get(messageID);

        /**
         * 當前匿名聊天基本角色
         * 管理員(可進行管理訊息)
         * 匿名發送者
         * 其他人
         */
        const selectmenu = new StringSelectMenuBuilder()
            .setCustomId(`nnc-select`)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(translations["select-chose_action"]);
        // 其他人
        selectmenu.addOptions(
            {
                label: translations["select-replyMsg"],
                value: 'replyMsg',
                emoji: '🗨',
            },
        );
        // 發送訊息者
        if (member.id === ncc_member.id) {
            selectmenu.addOptions(
                {
                    label: translations["select-editMsg"],
                    value: 'editMsg',
                    emoji: '✏',
                },
            );
            selectmenu.addOptions(
                {
                    label: translations["select-deleteMsg"],
                    value: 'deleteMsg',
                    emoji: '🗑',
                },
            );
        }
        // 管理員控制選項
        if (member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            selectmenu.addOptions(
                {
                    label: translations["select-whoseMsg"],
                    value: 'whoseMsg',
                    emoji: '㊙',
                },
            );
        }

        await interaction.followUp({
            content: `${ translations["content-chose_action"] }`,
            components: [
                new ActionRowBuilder()
                    .addComponents(selectmenu),
            ],
        });

    },
};
