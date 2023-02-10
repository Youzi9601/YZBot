const { EmbedBuilder, PermissionsBitField, codeBlock, ChannelType } = require("discord.js");
const client = require("./../../bot");
const config = require("./../../../Config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "messageCreate",
};

client.on('messageCreate', async (message) => {
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

    const prefix = await db.get(`guild_prefix_${message.guild.id}`) || config.Prefix || "?";

    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;

    const command = client.prefix_commands.get(cmd);

    if (!command) return;

    if (command) {
        if (command.permissions) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) {
                return await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`🚫抱歉，您無權使用此命令。`)
                            .setColor("Red"),
                    ],
                })
            }
        }

        if (command.owner, command.owner == true) {
            if (config?.developers) {
                if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) {
                    return await message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`🚫 抱歉，只有開發者可以使用此命令！`)
                            // 允許的用戶:\n**${allowedUsers.join(", ")}**
                                .setColor("Red"),
                        ],
                    })
                }
            }
        }

        try {
            command.run(client, message, args, prefix, config, db);
        } catch (error) {
            console.error(`[#${client.shard.ids}]  執行訊息命令時發生錯誤：`)
            console.error(error);
        }
    }
});
