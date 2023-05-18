const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { useMasterPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('音樂系統')
        .addSubcommand(s =>
            s
                .setName('play')
                .setDescription("播放曲目")
                .addStringOption(o =>
                    o
                        .setName('query')
                        .setDescription('尋找的內容(關鍵字)')
                        .setAutocomplete(true)
                        .setRequired(true),
                ),
        )
        .addSubcommand(s =>
            s
                .setName('pause')
                .setDescription("切換暫停與播放"),
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Music'],
    cooldown: 5000,
    OnlyRunOnGuilds: true,
    disabled: true, // 記得改成false再來執行這側是
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommandGroup == undefined) {
            if (subcommand == "play") {
                await require("./music-func/play").load(client, interaction, config, db);
            } else if (subcommand == "pause") {
                await require("./music-func/pause").load(client, interaction, config, db);
            }
        }

    },
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').AutocompleteInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    autocomplete: async (client, interaction, config, db) => {
        const focusedOption = interaction.options.getFocused(true);
        // 給予回應選像
        if (focusedOption.name === "query") {
            const player = useMasterPlayer();
            const query = interaction.options.getString('query', true);
            if (!query) return interaction.respond();
            const results = await player.search(query);

            return interaction.respond(
                results.tracks.slice(0, 5).map((t) => ({
                    name: `${t.title} (${t.author} - ${t.source})`,
                    value: t.url,
                })),
            );
        }
    },

};

