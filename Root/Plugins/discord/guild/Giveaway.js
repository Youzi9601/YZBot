const { log } = require('./../../../Utils/log');
module.exports =
    /**
     *
     * @param {import('./../../../bot').client} client
     */
    (client) => {
        // We now have a client.giveawaysManager property to manage our giveaways!
        client.giveawaysManager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
            log('info', `${member.user.tag} 參加 #${giveaway.messageId} (${reaction.emoji.name})`, true, client);
        });

        client.giveawaysManager.on('giveawayReactionRemoved', (giveaway, member, reaction) => {
            log('info', `${member.user.tag} 取消參加 #${giveaway.messageId} (${reaction.emoji.name})`, true, client);

        });

        client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
            log('info', `抽獎 #${giveaway.messageId} 結束！獲獎者：${winners.map((member) => member.user.username).join(', ')}`, true, client);
        });
    };