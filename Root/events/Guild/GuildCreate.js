const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildCreate,
    /**
     *
     * @param {import('./../../bot').client} client
     * @param {import('discord.js').Guild} guild
     * @returns
     */
    async execute(client, guild) {
        client.console('Log', `+伺服器 > ${ guild.name } (${ guild.id })`);

        // 設定伺服器命令 & 高級命令 & 開發者命令
        if (client.commands.data.guild.length > 0) {
            const g = await guild.fetch();
            // 預設
            let c = client.commands.data.guild;
            // 開發者
            if (g.id == client.config.guild.ServerID)
                c = [...c, ...client.commands.data.developer];

            // 高級
            if ((require('./../../../Storage/premium.json') || []).includes(g.id))
                c = [...c, ...client.commands.data.premium];
            await guild.commands.set(c);
            client.console('Log', `[HANDLER - BUILDIING] ${ guild.id }`.brightGreen);
        }
    },
};