/**
 *
 * @param {Client} client
 * @param {interactionCreate} interaction
 * @param {container} container
 */
function reactions_create(client, interaction, container) {
    // 取得命令內容
    const channel_id =
        interaction.options.getString('channel_id') || interaction.channel.id;
    const emoji = interaction.options.getString('emoji');
    const message_id = interaction.options.getString('message_id');
    msg = {
        channel: channel_id,
        message: message_id,
    };
    msg.react(emoji);
}
module.exports = { reactions_create };