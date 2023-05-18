const { glob } = require("glob");
const { Player } = require('discord-player');

const ffmpeg = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpeg.path;
process.env.DP_NO_FFMPEG_WARN = true; // Mute ffmpeg warning

const {
    SpotifyExtractor,
    AppleMusicExtractor,
    SoundCloudExtractor,
    lyricsExtractor,
    VimeoExtractor,
    ReverbnationExtractor,
    AttachmentExtractor,
} = require('@discord-player/extractor');

/**
 *
 * @param {import('discord.js').Clinet} client
 */
module.exports = async (client) => {
    const player = new Player(client);
    await player.extractors.register(AppleMusicExtractor, {});
    await player.extractors.register(AttachmentExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
    await player.extractors.register(SoundCloudExtractor, {});
    await player.extractors.register(VimeoExtractor, {});
    await player.extractors.register(lyricsExtractor, {});
    await player.extractors.register(ReverbnationExtractor, {});

    // 註冊事件
    const events = await glob(`Music/events/**/*.js`, { ignore: ['**/*.func.js', '**/*-func/**'] });

    for (let file of events) {

        let pull = require(`${__dirname}/../${file}`.replaceAll('\\', '/'));

        if (pull.name) {
            if (pull.disabled)
                continue;
            player.events.on(pull.name, (...args) => pull.execute(client, ...args));
            client.console('Log', `[Music - EVENTS] 加載了一個文件： ${pull.name}`.brightGreen);
        } else {
            client.console('Log', `[Music - EVENTS] 無法加載文件 ${file}。缺少別名或是執行內容。`.red);
            continue;
        }

    }
};

