/**
 * 網頁設定
 */
const db = require('quick.db');
const moment = require('moment');
const chalk = require('chalk');
const {
    Client,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} = require('discord.js');
const fs = require('fs-extra');
const { config } = require('../../../bot');

let port80 = false;
if (config.web.port == 80) {
    port80 = true;

}

/**
 * @param {import('discord.js').Client} client 機器人
 */

module.exports = {
    web: async (client) => {
        console.info(
            chalk.gray(
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
            ) + chalk.green('讀取網頁中！'),
        );
        // #region 網頁
        /**
         *
         * 網頁
         *
         */

        // #region 網站


        const DBD = require('discord-dashboard');

        const DarkDashboard = require('dbd-dark-dashboard');


        await DBD.useLicense(`${config.web.License_ID}`);
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            // noCreateServer: config.web.noWeb,
            acceptPrivacyPolicy: true,
            minimizedConsoleLogs: true,


            port: config.web.port,
            client: {
                id: `${config.clientID}`,
                secret: `${config.clientSECRET}`,
            },
            redirectUri: `${config.web.domain}${port80 ? '' : `:${config.web.port}`}/discord/callback`,
            domain: `${config.web.domain}`,
            bot: client,
            requiredPermissions: [DBD.DISCORD_FLAGS.Permissions.ADMINISTRATOR],
            theme: DarkDashboard({
                colourUpperCase: 'Color',
                colourLowerCase: 'color',
                information: {
                    createdBy: `${config.botName}`,
                    websiteTitle: `${config.botName} 機器人設定網頁`,
                    websiteName: `${config.botName}`,
                    websiteUrl: `${config.web.domain}${port80 ? '' : `:${config.web.port}`}`,
                    dashboardUrl: `${config.web.domain}${port80 ? '' : `:${config.web.port}`}`,
                    supporteMail: 'yoyowu9601.tw@gmail.com',
                    supportServer: `https://discord.gg/${config.invite_code}`,
                    imageFavicon: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    pageBackGround: 'linear-gradient(#2CA8FF, #155b8d)',
                    loggedIn: '登錄成功！',
                    mainColor: '#29FB77',
                    subColor: '#187AFD',
                    // preloader: "owo..."
                    preloader: `${config.botName} 正在加載...`,
                },
                popupMsg: {
                    savedSettings: '變更已儲存！',
                    noPerms: '你沒有權限！',
                },
                invite: {
                    clientId: `${config.clientID}`,
                    scopes: ['bot'],
                    permissions: '8',
                    redirectUri: '',
                    otherParams: '',
                },
                // supportServer: {
                //    slash: '/support-server',
                //    inviteUrl: `https://discord.gg/${config.invite_code}`,
                // },
                guildAfterAuthorization: {
                    use: true,
                    guildId: `${config.ServerID}`,
                },
                sidebar: {
                    keepDefault: false,
                    list: [{
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"/></svg>',
                        title: '<p style="margin-left: 40px;">首頁</p>',
                        link: '/',
                        id: 'index',
                    },
                    {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M16 96C16 69.49 37.49 48 64 48C90.51 48 112 69.49 112 96C112 122.5 90.51 144 64 144C37.49 144 16 122.5 16 96zM480 64C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H192C174.3 128 160 113.7 160 96C160 78.33 174.3 64 192 64H480zM480 224C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H192C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224H480zM480 384C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416C160 398.3 174.3 384 192 384H480zM16 416C16 389.5 37.49 368 64 368C90.51 368 112 389.5 112 416C112 442.5 90.51 464 64 464C37.49 464 16 442.5 16 416zM112 256C112 282.5 90.51 304 64 304C37.49 304 16 282.5 16 256C16 229.5 37.49 208 64 208C90.51 208 112 229.5 112 256z"/></svg>',
                        title: '命令列表',
                        link: '/commands',
                        id: 'commands',
                    },
                    {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M464 64C490.5 64 512 85.49 512 112V176C512 202.5 490.5 224 464 224H48C21.49 224 0 202.5 0 176V112C0 85.49 21.49 64 48 64H464zM448 128H320V160H448V128zM464 288C490.5 288 512 309.5 512 336V400C512 426.5 490.5 448 464 448H48C21.49 448 0 426.5 0 400V336C0 309.5 21.49 288 48 288H464zM192 352V384H448V352H192z"/></svg>',
                        title: '設定',
                        link: '/manage',
                        id: 'manage',
                    },
                    {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24px" height="24px" fill="#29FB77" style="position: absolute; margin-left: 8px; margin-top: 2px;" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>',
                        title: '隱私政策',
                        link: '/privacy-policy',
                        id: 'pp',
                    },
                    ],
                },
                index: {
                    card: {
                        category: `${config.botName} 的面板 ｜ 一切的中心`,
                        title: `歡迎來到 ${config.botName} 機器人的官網，您可以在其中控制機器人的核心功能。`,
                        image: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        footer: `<a href="https://discord.gg/${config.invite_code}"> ↠ 點我加入伺服器！</a>`,
                    },
                    information: {
                        category: '公告',
                        title: '信息',
                        description: '這個機器人和面板目前正在進行中，如果您發現任何不和諧的問題，請與我聯繫。',
                        footer: '2022/01/27',
                    },
                    feeds: {
                        category: '摘要',
                        title: '機器人異常離線',
                        description: '我們已經針對此事件做修復！',
                        footer: '2022/03/25',
                    },
                    newupdate: {
                        category: '更新',
                        title: 'v0.0.2',
                        description: '上架了機器人的官網！',
                        footer: '2022/03/27',
                    },
                },
                commands: [
                    {
                        category: '命令列表',
                        subTitle: '方便您查詢想要的命令',
                        aliasesDisabled: true,
                        list: [{
                            commandName: 'help',
                            commandUsage: '/help',
                            commandDescription: '叫出命令列表',
                            // commandAlias: "沒有別稱"
                        },
                        {
                            commandName: 'bot',
                            commandUsage: '/bot <子命令>',
                            commandDescription: '控制機器人',
                            // commandAlias: "Alias",
                        },
                        {
                            commandName: '敬請期待！',
                            commandUsage: '--',
                            commandDescription: '我們將會有更多的命令新增！',
                            // commandAlias: "Alias",
                        },
                        ],
                    },
                ],

                guilds: {
                    cardTitle: '伺服器',
                    cardDescription: '以下是您目前擁有權限的所有伺服器：',
                    type: 'blurlist',
                },
                guildInfo: {
                    cardTitle: '伺服器資訊',
                    cardDescription: '關於您的服務器的概述',
                },
                guildSettings: {
                    cardTitle: '伺服器',
                    cardDescription: '在這裡您可以管理公會的所有設置：',
                    customFooterCard:
                    {
                        subtitle: '也可多加利用 [ / ]斜線命令 來快速設定！',
                        title: '變數轉換表',
                        customHTML: '目前正在製作中！',
                        footer: '設定小提示',
                    },

                },
            }),
            settings: [
                {
                    categoryId: 'setup',
                    categoryName: '基本設定',
                    categoryDescription: '設定機器人的基本設置',
                    categoryOptionsList: [
                        {
                            optionId: 'lang',
                            optionName: '語言',
                            optionDescription: '更改機器人的語言',
                            optionType: DBD.formTypes.select({ '繁體中文': 'zh_TW', 'English(尚未完成！)': 'en' }),
                            getActualSet: async ({ guild }) => {
                                const langsSettings = await db.get(
                                    `websystem.${guild.id}.setting.lang`,
                                ) ?? 'zh_TW';
                                return langsSettings || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const db_data = `websystem.${guild.id}.setting.lang`;
                                newdate_update(newData, db_data);
                            },
                        },
                    ],
                },
                {
                    categoryId: 'channels',
                    categoryName: '頻道指向設定',
                    categoryDescription: '設定頻道的相關功能',
                    categoryOptionsList: [
                        {
                            optionId: 'ai.say',
                            optionName: '聊天系統',
                            optionDescription: '與機器人互動',
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const db_data = `websystem.${guild.id}.guild.channel.ai.channel`;
                                const channel = await db.get(db_data) ?? null;
                                return channel || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                // 檢查是否要清除
                                const db_data = `websystem.${guild.id}.guild.channel.ai.channel`;
                                newdate_update(newData, db_data);

                            },
                        },
                    ],
                },
                {
                    categoryId: 'msg',
                    categoryName: '訊息設定',
                    categoryDescription: '設定機器人的各種訊息',
                    categoryOptionsList: [
                        //

                        // 加入
                        {
                            optionId: 'join.disabled',
                            optionName: '成員加入',
                            optionDescription: '啟用此功能?',
                            optionType: DBD.formTypes.switch(false),

                            getActualSet: async ({ guild }) => {
                                const disabled = await db.get(
                                    `websystem.${guild.id}.guild.join.disabled`,
                                ) ?? null;
                                return disabled || true;
                            },
                            setNew: async ({ guild, newData }) => {
                                const db_data = `websystem.${guild.id}.guild.join.disabled`;
                                newdate_update(newData, db_data);
                            },
                        },
                        {
                            optionId: 'join.channel',
                            optionName: '',
                            optionDescription: '當成員加入時，歡迎訊息所發送的頻道',
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),

                            getActualSet: async ({ guild }) => {
                                const embedjoin = await db.get(
                                    `websystem.${guild.id}.guild.join.channel`,
                                ) ?? null;
                                return embedjoin || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const db_data = `websystem.${guild.id}.guild.join.channel`;
                                newdate_update(newData, db_data);
                            },
                            /* 檢查*/
                            /*
                            allowedCheck: async ({ guild, user }) => {
                                if ((await db.get(
                                    `websystem.${guild.id}.guild.join.disabled`,
                                ) ?? true) == false) return { allowed: false, errorMessage: '請開啟"啟用"的控制紐！' };
                                return { allowed: true, errorMessage: null };
                            }
                            */
                        },
                        {
                            optionId: 'join.msg',
                            optionName: '',
                            optionDescription: '成員加入時所顯示的訊息',
                            optionType: DBD.formTypes.embedBuilder(
                                //
                                {
                                    username: client.user.username,
                                    avatarURL: client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL,
                                    defaultJson: {
                                        content: '',
                                        embed: {
                                            timestamp: new Date().toISOString(),
                                            title: '歡迎 {{username}} 加入伺服器！',
                                            description: '你是第 {{member_count}} 位！',
                                        },
                                    },
                                },
                                //
                            ),
                            getActualSet: async ({ guild }) => {
                                const embedjoin = await db.get(
                                    `websystem.${guild.id}.guild.join.msg`,
                                ) ?? null;
                                return embedjoin || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const db_data = `websystem.${guild.id}.guild.join.msg`;
                                newdate_update(newData, db_data);
                            },
                        },
                        // 離開
                        {
                            optionId: 'leave.disabled',
                            optionName: '成員離開',
                            optionDescription: '啟用此功能?',
                            optionType: DBD.formTypes.switch(false),

                            getActualSet: async ({ guild }) => {
                                const disabled = await db.get(
                                    `websystem.${guild.id}.guild.leave.disabled`,
                                ) ?? null;
                                return disabled || true;
                            },
                            setNew: async ({ guild, newData }) => {
                                const db_data = `websystem.${guild.id}.guild.leave.disabled`;
                                newdate_update(newData, db_data);
                            },
                        },
                        {
                            optionId: 'join.channel',
                            optionName: '',
                            optionDescription: '當成員加入時，歡迎訊息所發送的頻道',
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),

                            getActualSet: async ({ guild }) => {
                                const embedleave = await db.get(
                                    `websystem.${guild.id}.guild.leave.channel`,
                                ) ?? null;
                                return embedleave || null;
                            },
                            setNew: async ({ guild, newData }) => {

                                const db_data = `websystem.${guild.id}.guild.leave.channel`;
                                newdate_update(newData, db_data);
                            },
                        },
                        {
                            optionId: 'leave.msg',
                            optionName: '',
                            optionDescription: '成員離開時所顯示的訊息',
                            optionType: DBD.formTypes.embedBuilder(
                                //
                                {
                                    username: client.user.username,
                                    avatarURL: client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL,
                                    defaultJson: {
                                        content: '',
                                        embed: {
                                            timestamp: new Date().toISOString(),
                                            title: '感謝 {{username}} 離開伺服器！',
                                            description: '成員人數： {{member_count}} 位！',
                                        },
                                    },
                                },
                                //
                            ),
                            getActualSet: async ({ guild }) => {
                                const embedjoin = await db.get(
                                    `websystem.${guild.id}.guild.leave.msg`,
                                ) ?? null;
                                return embedjoin || null;
                            },
                            setNew: async ({ guild, newData }) => {

                                const db_data = `websystem.${guild.id}.guild.leave.msg`;
                                newdate_update(newData, db_data);

                            },
                        },
                        //
                    ],
                },
            ],
        });
        Dashboard.init();
        // #endregion
        //
        // #endregion

    },
};


function newdate_update(newData, db_data) {
    if (newData === '' && db.get(db_data)) {
        db.delete(db_data);
        return;
    } else if (newData === '' && !db.get(db_data)) {
        return;
    } else {
        db.set(db_data, newData);
        return;
    }
}