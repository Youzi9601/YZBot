module.exports =
    (client) => {
        const plugins = [
            './discord/guild/Giveaway',
            './discord/guild/music',
            './discord/guild/counting',
            './discord/guild/chatbot',
            './discord/guild/suggestions_channel',
            './discord/guild/button_role',
        ];
        plugins.forEach(path => {
            require(`${ path }`)(client);
        });

    };