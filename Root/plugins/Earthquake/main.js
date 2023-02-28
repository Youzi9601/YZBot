/**
 * 此功能待添加，因為涉及資料庫以及API資料更新問題。
 * @deprecated 暫時性廢除
 */
const Discord = require('discord.js');
const client = new Discord.Client(
    { intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
        Discord.Partials.Reaction,
    ] },
);
const dotenv = require('dotenv');
const requests = require('node:https');
const fs = require('node:fs');
const { Sets, sosIn } = require('./function');

dotenv.config();
const data = new Sets(
    process.env.token,
    process.env.TaiwanCWBAPIkey,
);

function setup() {
    try {
        fs.openSync(data.checkFile, 'r');
    } catch {
        fs.writeFileSync(data.checkFile, JSON.stringify({}, null, 4));
        console.log('建立 check.json 完成');
    }
}

client.on('ready', () => {
    console.log('-'.repeat(15));
    console.log(client.user.username);
    console.log(client.user.id);
    console.log(client.user);
    console.log('-'.repeat(15));
    setup();
    if (data.APIToken) {
        earthquake.ref();
        console.log('地震報告啟動');
    } else {
        console.log('請至 https://opendata.cwb.gov.tw/userLogin 獲取中央氣象局TOKEN並放置於 .env 檔案中');
    }
});

const earthquake = setInterval(async () => {

    // 大型地震
    const API = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${data.APIToken}&format=JSON&areaName=`;
    // 小型地震
    const API2 = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization=${data.APIToken}&format=JSON`;

    const b = await requests.get(API);
    const s = await requests.get(API2);
    const bData = JSON.parse(b.body);
    const sData = JSON.parse(s.body);
    const _API = bData.records.earthquake[0].earthquakeInfo.originTime;
    const _API2 = sData.records.earthquake[0].earthquakeInfo.originTime;

    async function goTo(how, now) {
        for (const ch of data.channels) {
            await sosIn(client.channels.cache.get(ch), { [API]: bData, [API2]: sData }[how], data);
        }
        fs.writeFileSync(data.checkFile, JSON.stringify(now, null, 4));
    }

    const file = JSON.parse(fs.readFileSync(data.checkFile, 'utf8'));
    [API, API2].forEach((i) => {
        if (!file[i]) {
            file[i] = '';
        }
    });

    if (file[API] !== _API) {
        file[API] = _API;
        await goTo(API, file);
    }
    if (file[API2] !== _API2) {
        file[API2] = _API2;
        await goTo(API2, file);
    }
}, 10000);

client.login(data.token);