const { Client, Channel, Message, ReactionEmoji } = require('discord.js');

/**
 *
 * @param {import('discord.js').Client} client 機器人
 * @param {Channel.id} channel_id 頻道id
 * @returns 頻道資訊
 */
function getChannel(channel_id, Client) {
    // 取得頻道資訊
    Client.channels
        .fetch(channel_id)
        .then(channel => { // 取得頻道
            return channel;
        });

}
/**
 *
 * @param {import('discord.js').Client} client 機器人
 * @param {Message.id} message_id 訊息id
 * @param {Channel} channel 頻道id
 * @returns 訊息資訊
 * @died
 */
function getMessage(message_id, channel, Client) {
    // 取得訊息
    channel.fetch;
    channel.messages.fetch(message_id)
        .then(message => {
            console.info(message.content);
            return message;
        })
        .catch(console.error);
}
/**

messages.fetch({ limit: 100 }).then(messages => {
  console.info(`Received ${messages.size} messages`);
  //Iterate through the messages here with the variable "messages".
  messages.forEach(message => console.info(message.content))
})*/

module.exports = {
    getChannel,
    getMessage,
};