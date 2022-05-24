const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
module.exports = {
    name: 'help_menu',
    /**
   *
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').SelectMenuInteraction} interaction
   * @param {*} container
   */
    run: async (client, interaction, container) => {
        let embed = new MessageEmbed()
            .setAuthor(
                {
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    name: `${client.user.username} 幫助介面`,
                })
            .setColor('RANDOM')
            .setDescription('請選擇一個類別！');
        const type = interaction.values[0];

        if (type == 'normal') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜基本')
                .setDescription(
                    ['目前正在製作中...敬請期待！',
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**基本**',
                        '```diff',
                        '/help 取得這個幫助列表',
                        '/info 資訊',
                        '    ◟ user [user] 查看成員的資訊',
                        '    ◟ server 查看伺服器的資訊',
                        '    ◟ bot 查看機器人的資訊',
                        '/ping 查看機器人的連線',
                        '/invite 邀請我！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');

        } else if (type == 'manage') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜管理')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**管理**',
                        '```diff',
                        '/ban <user> [reason] 封禁成員，',
                        '/kick <user> [reason] 踢出成員',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');


        } else if (type == 'music') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜音樂')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**音樂**',
                        '```diff',
                        '/play 播放',
                        '    ◟ song <url> 撥放音樂',
                        '    ◟ playlist <url> 撥放音樂清單',
                        '    ◟ search <關鍵字> 搜尋音樂',
                        '/pause 暫停音樂',
                        '/resume 恢復音樂',
                        '/queue 顯示當前列隊',
                        '/leave 離開語音',
                        '/music-info 顯示音樂撥放進度',
                        '/shuffle 隨機打亂音樂撥放順序',
                        '/skip 跳過此首音樂',
                        '/skipto <順位> 跳到指定順位的歌曲',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');
        } else if (type == 'fun') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜遊戲/玩樂')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**遊戲/玩樂**',
                        '```diff',
                        '/fun 樂趣',
                        '    ◟ 敬請期待！',
                        '/giveaways 抽獎系統',
                        '         ◟ create <prize> <duration> [winners] [channel] [drop]',
                        '              創建抽獎活動',
                        '         ◟ edit <message_id> [winners] [new_prize] [addtime]',
                        '              編輯抽獎活動',
                        '         ◟ pause <message_id> 暫停/繼續 抽獎',
                        '         ◟ reroll <giveaway> 重新抽出幸運兒',
                        '         ◟ end <message_id> 強制結束抽獎',
                        '         ◟ delete <message_id> 刪除抽獎',
                        '/together 一起在語音頻道同樂！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');
        } else if (type == 'setup') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜設置功能')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**設置功能**',
                        '```diff',
                        '/setup 設置功能',
                        '                [channel] 頻道(無選擇則為指令執行之頻道)',
                        '    ◟ chat-bot 一個聊天機器人',
                        '    ◟ suggestions-channel 建議頻道',
                        '    ◟ counting 一個數數字的頻道',
                        '    ◟ 敬請期待！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');

        } else if (type == 'control') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜控制')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**控制**',
                        '```diff',
                        '/bot 機器人',
                        '   ◟ reactions-create <emoji> <message_id> 以機器人身分對訊息做反應',
                        '   ◟ edit-message <message_id> ... 以機器人身分編輯訊息',
                        '   ◟ say ... 以機器人身分發送訊息',
                        '   ◟ delete-msg <message_id> 以機器人身分刪除訊息',
                        '/? 敬請期待！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');

        } else if (type == 'developers') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜開發者')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**機器人開發者專用**',
                        '```diff',
                        '/developers 開發者命令',
                        '   ◟ leave-server <id> 離開伺服器',
                        '   ◟ list-servers 列出伺服器',
                        '   ◟ exit 關閉機器人',
                        '>eval 評估Javascript代碼',
                        '>exec 執行終端機',
                        '/? 敬請期待！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');

        } else if (type == 'others') {
            embed = new MessageEmbed()
                .setTitle('Help 命令列表｜其他')
                .setDescription(
                    [
                        '`<>` - 必填｜`[]` - 可選',
                        '',
                        '**其他**',
                        '```diff',

                        '/? 敬請期待！',
                        '```',
                    ].join('\n'))
                .setAuthor(
                    {
                        iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        name: `${client.user.username} 幫助介面`,
                    })
                .setColor('RANDOM');
        }
        //
        interaction.update({ embeds: [embed] });
    },
};