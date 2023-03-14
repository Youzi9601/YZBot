/**
 * 這是一個廢棄的項目
 * @deprecated 此檔案當前不會使用，因其 AI 的 API 其實還是有些問題，像是生成不當的言論
 */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('用 ChatGPT 來幫助你任何事情！')
        .addStringOption(s =>
            s
                .setName('question')
                .setDescription('你想要問ChatGpt的問題')
                .setRequired(true))
        .setDefaultMemberPermissions(
            PermissionFlagsBits.SendMessages,
        )
        .setDMPermission(false)
        .toJSON(),
    type: ['Premium'],
    disabled: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} config
     * @param {*} db
     * @returns
     */
    run: async (client, interaction, config, db) => {


        const question = interaction.options.get('question').value;
        // 呼叫 ChatGPT API 取得回答
        const { Configuration, OpenAIApi } = require("openai");

        const configuration = new Configuration({
            apiKey: client.config.plugins?.client.openai.openaiKEY,
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: question,
            temperature: 0.5,
            n: 1,
            max_tokens: 100,
        });
        client.console('Log', undefined, undefined, undefined, completion.data);

        const answer = completion.data.choices[0].text.trim();
        interaction.reply(answer);


    },
};