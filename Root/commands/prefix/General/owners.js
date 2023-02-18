const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "owners",
        description: "僅回复註冊所有者。",
    },
    permissions: ['SendMessages'], // Since the "owner" is TRUE, then we can set the permissions to 'sendMessages'.
    owner: true,
    disabled: true,
    /**
     *
     * @param {*} client
     * @param {*} message
     * @param {*} args
     * @param {*} prefix
     * @param {import('./../../../../Config')} config
     * @param {*} db
     * @returns
     */
    run: async (client, message, args, prefix, config, db) => {

        const ownersID = config.developers;
        if (!ownersID) return;

        const ownersARRAY = [];

        ownersID.forEach(Owner => {
            const fetchedOWNER = message.guild.members.cache.get(Owner);
            if (!fetchedOWNER) ownersARRAY.push("*Unknown User#0000*");
            ownersARRAY.push(`${fetchedOWNER}`);
        });

        await message.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`Only owners command! \nOwners: **${ownersARRAY.join(", ")}**`)
                .setColor("Yellow"),
        ] })

    },
};
