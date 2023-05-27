const { EmbedBuilder, PermissionsBitField, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    /**
     *
     * @param {import('./../../bot').client} client
     * @param {import('discord.js').Message} message
     * @returns
     */
    async execute(client, message) {


        if (message.author.bot) return;

        if (message.channel.type == ChannelType.DM
        || message.channel.type == ChannelType.GroupDM) {
            return;
        /*
        await message.reply({
            embeds: [
                {
                    title: '機器人不支援私信、群組喔！',
                    description: `${ message.client.user.tag } 無法在這裡執行與接收指令，只可傳送相關事情`,
                    color: `000000`,
                },
            ],
        })
        */
        }

        const all_prefix = client.config.prefix;
        if (!message.guild) return;
        // 檢查是否已經執行過了
        let isRun = false;
        all_prefix.forEach(async prefix => {

            if (!message.content.startsWith(prefix)) return;
            if (!message.member) message.member = await message.guild.fetchMember(message);

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            if (cmd.length == 0) return;

            const command = client.prefix_commands.get(cmd);

            if (!command) return;

            if (command) {

                /*
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('delete')
                            .setLabel('刪除回應')
                            .setStyle(ButtonStyle.Danger),
                    );
                */

                if (command.permissions) {
                    if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) {
                        return;
                        /*
                        return await message.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`🚫抱歉，您無權使用此命令。`)
                                    .setColor(0xf24e43),
                            ],
                            components: [row],

                        });
                        */
                    }
                }

                if (command.owner, command.owner == true) {
                    if (client.config?.developers) {
                        if (!client.config.developers.some(ID => message.member.id.includes(ID))) {
                            return;
                            /*
                            return await message.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(`🚫 抱歉，只有開發者可以使用此命令！`)
                                    // 允許的用戶:\n**${allowedUsers.join(", ")}**
                                        .setColor(0xf24e43),
                                ],
                                components: [row],
                            });
                            */
                        }
                    }
                }

                try {
                    if (isRun) return;
                    isRun = true;
                    command.run(client, message, args, prefix, client.config, client.db);
                } catch (error) {
                    client.console('Error', `執行訊息命令時發生錯誤：`);
                    client.console('Error', { promise: error });
                }
            }
        });


    },


};