module.exports =
    (client) => {
    	const plugins = [
    		'./discord/guild/Giveaway',
    		// 因為隱私政策導致不能使用
    		// './discord/guild/music',
    		'./discord/guild/counting',
    		'./discord/guild/chatbot',
    		// './discord/guild/openai_chatGPT',
    		'./discord/guild/suggestions_channel',
    		'./discord/guild/button_role',
    	];
    	plugins.forEach(path => {
    		require(`${ path }`)(client);
    	});

    };