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
                        '/timeout <user> <duration> [reason] 禁言成員',
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
                        '+ 播放',
                        '/play 播放音樂',
                        '/nowplaying 取得當前播放的曲目',
                        '/autoplay 啟用或禁用自動播放',
                        '/join 讓機器人加入語音頻道',
                        '/leave 讓機器人離開語音頻道',
                        '/queue 顯示列隊',
                        '+ 控制',
                        '/pause 暫停-暫停當前播放的曲目',
                        '/resume 繼續-恢復當前播放的曲目',
                        '/skip 跳過-跳過列隊中的當前歌曲',
                        '/stop 停止-停止播放歌曲',
                        '/volume 更改播放的音量',
                        '/jump 跳轉到隊列中的曲目編號',
                        '/loop 循環播放當前曲目/列隊曲目',
                        '/filter 更改音頻過濾器',
                        '/previous 播放上一首歌曲',
                        '/seek 將播放時間設置到另一個位置',
                        '/shuffle 隨機播放列隊歌曲',
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
                        '    ◟ 8ball 一個神奇海螺?',
                        '    ◟ get-ip 從網址取得IP資訊',
                        '    ◟ google Google搜尋一下!?',
                        '/giveaways 抽獎系統',
                        '    ◟ create <prize> <duration> [winners] [channel] [drop]',
                        '              創建抽獎活動',
                        '    ◟ edit <message_id> [winners] [new_prize] [addtime]',
                        '              編輯抽獎活動',
                        '    ◟ pause <message_id> 暫停/繼續 抽獎',
                        '    ◟ reroll <giveaway> 重新抽出幸運兒',
                        '    ◟ end <message_id> 強制結束抽獎',
                        '    ◟ delete <message_id> 刪除抽獎',
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
                        '  [channel] 頻道(無選擇則為指令執行之頻道)',
                        '    ◟ chat-bot 一個聊天機器人',
                        '    ◟ suggestions-channel 建議頻道',
                        '    ◟ counting 一個數數字的頻道',
                        '    ◟ 敬請期待！',
                        '/setting 設定[開發人員暫定使用]',
                        '    ◟ guild 伺服器系列',
                        '        | bot-logger 設定機器人日誌輸出',

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
                        '    ◟ chat 聊天系列',
                        '        | send ... 以機器人身分發送訊息',
                        '        | edit <message_id> ... 以機器人身分編輯訊息',
                        '        | reactions-create <emoji> <message_id> 以機器人身分對訊息做反應',
                        '    ◟ webhook webhook系列',
                        '        | send ... 創建webhook訊息',
                        '        | edit <message_id> ... 編輯webhook訊息(注意：必須為相同的webhook才能編輯訊息)',
                        '        | clone ... 創建一個以其他成員的身分所發出的webhook訊息！',
                        '    ◟ clone-reactions <emojis> 複製任何表情符號並加入到伺服器中！(除了原版)',
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
                        '    ◟ leave-server <id> 離開伺服器',
                        '    ◟ list-servers 列出伺服器',
                        '    ◟ exit 關閉機器人',
                        '/bot set-status 設定機器人狀態',
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
