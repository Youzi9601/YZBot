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

                if (command.permissions) {
                    if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) {
                        return;
                    }
                }

                if (command.owner, command.owner == true) {
                    if (client.config?.developers) {
                        if (!client.config.developers.some(ID => message.member.id.includes(ID))) {
                            return;
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