const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("./../../../bot");
const config = require("./../../../Config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "messageCreate",
};

client.on('messageCreate', async (message) => {
    if (message.channel.type !== 0) return;
    if (message.author.bot) return;

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
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`🚫抱歉，您無權使用此命令。`)
                            .setColor("Red"),
                    ],
                })
            }
        }

        if (command.owner, command.owner == true) {
            if (config.Users?.OWNERS) {
                const allowedUsers = [];

                config.Users.OWNERS.forEach(user => {
                    const fetchedUser = message.guild.members.cache.get(user);
                    if (!fetchedUser) return allowedUsers.push('*未知使用者#0000*');
                    allowedUsers.push(`${fetchedUser.user.tag}`);
                })

                if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) {
                    return message.reply({
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
            console.error(error);
        }
    }
});
