/**
 * 此功能待添加，因為涉及資料庫以及API資料更新問題。
 * @deprecated 暫時性廢除
 */
const Discord = require('discord.js');

class Sets {
    constructor(token, APIToken = null, kwargs = {}) {
        this.checkFile = kwargs.checkFile || "Storage/check.json";
        this.channels = kwargs.channels ? kwargs.channels.split(' ').map(x => parseInt(x)) : [];
        this.Tags = kwargs.Tags ? kwargs.Tags.split(' ') : [];
        this.APIToken = APIToken;
        this.token = token;
    }
}

function checkSos(ac) {
    const sosMap = {
        "0": "⚪",
        "1": "⚪",
        "2": "🟡",
        "3": "🟢",
        "4": "🟢",
        "5": "🔴",
        "6": "🟤",
        "7": "🟤",
        "8": "🟣",
        "9": "⚫",
    };
    return sosMap[parseInt(ac).toString()] + " ";
}

async function sosIn(channel, data, sets) {
    try {
        const inp = data["records"]["earthquake"][0];
        const inpInfo = inp["earthquakeInfo"];

        const helpAwa = inp["web"]; // 資料連結
        const earthquakeNo = inp["earthquakeNo"]; // 幾號地震

        const location = inpInfo["epiCenter"]["location"]; // 發生地點
        const originTime = inpInfo["originTime"]; // 發生時間
        const magnitudeType = inpInfo["magnitude"]["magnitudeType"]; // 規模單位
        const magnitudeValue = inpInfo["magnitude"]["magnitudeValue"]; // 規模大小
        const value = inpInfo["depth"]["value"]; // 地震深度
        const unit = inpInfo["depth"]["unit"]; // 深度單位
        const urlicon = inp["reportImageURI"]; // 地震報告icon
        const cha = checkSos(magnitudeValue);

        const embed = new Discord.EmbedBuilder()
            .setTitle(data["records"]["datasetDescription"])
            .setColor(0xff0000)
            .setTimestamp()
            .setAuthor(
                "台灣地震報告系統",
                "https://media.discordapp.net/attachments/345147297539162115/732527807435112478/data.png",
            )
            .setImage(urlicon)
            .addField(
                "報告連結",
                `[中央氣象局](${helpAwa})`,
                true,
            )
            .addField("編號", earthquakeNo, true)
            .addField("震央位置", location, true)
            .addField("發生時間", originTime, true)
            .addField(
                magnitudeType,
                `${cha}${magnitudeValue}`,
                true,
            )
            .addField("深度", `${value}${unit}`, true)
            .setFooter(
                "地震報告提供",
                "https://media.discordapp.net/attachments/345147297539162115/732527875839885312/ROC_CWB.png",
            );

        const inp2 = inp["intensity"]["shakingArea"];
        for (let i = 1; i < 10; i++) {
            for (let j = 0; j < inp2.length; j++) {
                if (inp2[j]["areaDesc"].includes(i.toString())) {
                    if (inp2[j]["areaDesc"].includes("最大震度")) {
                        const ai1 = inp2[j]["areaDesc"];
                        const ai2 = inp2[j]["areaName"];
                        embed.addField(` ${ai1} :`, ai2, false);
                    }
                }
            }
        }
        let user = "";
        for (const i of sets.Tags) {
            user += `<@${i}> `;
        }
        if (user) {
            await channel.send(`||提及:${user}||`);
        }
        await channel.send({ embeds: [embed] });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { sosIn, Sets };