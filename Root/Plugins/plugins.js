module.exports =
    (client) => {
        const plugins = [
            './discord/guild/Giveaway',
            './discord/guild/music',
            './discord/guild/counting',
            './discord/guild/chatbot',
            './discord/guild/suggestions_channel.js',
        ];
        plugins.forEach(path => {
            require(`${path}`)(client);
        });

    };