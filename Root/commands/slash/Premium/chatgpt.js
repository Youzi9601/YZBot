const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('用 ChatGPT 來幫助你任何事情！')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    disabled: true, // 記得改成false再來執行這側是
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {
        const openai = require('openai')('YOUR_OPENAI_API_KEY');

        const question = interaction.options.get('question').value
        const gptResponse = await openai.complete({
            engine: 'davinci',
            prompt: question,
            maxTokens: 150,
            n: 1,
            stop: ['\n'],
            temperature: 0.5,
        });

        const answer = gptResponse.data.choices[0].text.trim();
        interaction.reply(answer);


    },
}