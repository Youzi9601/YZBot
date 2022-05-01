const {
  Client,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require('discord.js');
const fs = require('fs-extra');

module.exports = {
  command: {
    name: 'help',
    description: '機器人的使用手冊',
  },
  clientPermissions: ['SEND_MESSAGES'],
  cooldown: 10000,
  run: async (client, interaction, container) => {
    /*
    await interaction.deferReply();
    let res = new MessageEmbed()
      .setAuthor({
        name: "指令幫助列表",
        url: interaction.client.user.displayAvatarURL(),
      })
      .setColor(0xe4fff6);
    const commands = [];
    const cmdDirs = fs.readdirSync("./Root/Commands/SlashCommands");
    for (const dir of cmdDirs) {
      const commandFiles = fs
        .readdirSync(`./Root/Commands/SlashCommands/${dir}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../${dir}/${file}`);
        commands.push({
          name: command.name,
          description: command.description,
        });
      }
    }

    const pages = commands.length - 1;

    const pageButtons = {
      home: new MessageButton({
        customId: "PageButtonHome",
        label: "◁ 頁首",
        style: "PRIMARY",
        disabled: true,
      }),
      prev: new MessageButton({
        customId: "PageButtonPrev",
        label: "↼ 下一頁",
        style: "PRIMARY",
        disabled: true,
      }),
      exit: new MessageButton({
        customId: "PageButtonExit",
        label: "x 刪除",
        style: "DANGER",
      }),
      next: new MessageButton({
        customId: "PageButtonNext",
        label: "上一頁 ⇀",
        style: "PRIMARY",
        disabled: pages.length < 2,
      }),
      end: new MessageButton({
        customId: "PageButtonEnd",
        label: "頁尾 ▷",
        style: "PRIMARY",
        disabled: pages.length < 2,
      }),
    };

    let index = 0;

    const row = new MessageActionRow({
      components: Object.values(pageButtons),
    });

    res = new MessageEmbed()
      .setAuthor({
        name: "指令列表",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription("機器人的指令清單")
      .setFooter({
        text: `${interaction.user.tag}・第 ${index + 1}/${pages} 頁`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields({
        name: `/${commands[index + 0].name}`,
        value: `${commands[index + 0].description}`,
      });

    interaction
      .editReply({
        embeds: [res],
        components: [row],
      })
      .then((message) => {
        message
          .createMessageComponentCollector({
            async filter(i) {
              if (!i.customId.startsWith("PageButton")) return false;
              await i.deferUpdate();
              return true;
            },
            idle: 30e3,
            componentType: "BUTTON",
          })
          .on("collect", function (i) {
            if (i.customId === "PageButtonExit") {
              this.stop("EXIT");
              return message.delete();
            }

            switch (i.customId) {
              case "PageButtonHome":
                index = 0;
                break;
              case "PageButtonPrev":
                index = Math.round(index - 1);
                break;
              case "PageButtonNext":
                index = Math.round(index + 1);
                break;
              case "PageButtonEnd":
                index = pages - 1;
                break;
            }

            pageButtons.home.setDisabled(index == 0);
            pageButtons.prev.setDisabled(index == 0);
            pageButtons.next.setDisabled(index == pages - 1);
            pageButtons.end.setDisabled(index == pages - 1);

            res = new MessageEmbed()
              .setAuthor({
                name: "指令列表",
                iconURL: interaction.client.user.displayAvatarURL(),
              })
              .setDescription("機器人的指令清單")
              .setFooter({
                text: `${interaction.user.tag}・第 ${index + 1}/${pages} 頁`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .addFields({
                name: `/${commands[index + 0].name}`,
                value: `${commands[index + 0].description}`,
              });

            const newRow = new MessageActionRow({
              components: Object.values(pageButtons),
            });

            interaction.editReply({
              embeds: [res],
              components: [newRow],
            });
          })
          .once("end", (_, reason) => {
            if (reason === "EXIT") return;
            message.delete();
          });
      });
      */

    //導入 discordjs-button-pagination 包        
    const paginationEmbed = require('discordjs-button-pagination');

    //使用 MessageEmbed 製作頁面
    //請記住，嵌入不應設置其頁腳，因為分頁方法在那裡設置頁面信息        
    const { MessageEmbed, MessageButton } = require('discord.js');
    const embed1 = new MessageEmbed()
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
        ].join('\n'));

    const embed2 = new MessageEmbed()
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
        ].join('\n'));
    const embed3 = new MessageEmbed()
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
          '/? 敬請期待！',
          '```',
        ].join('\n'));

    const embedN = new MessageEmbed()
      .setTitle('Help 命令列表｜控制')
      .setDescription(
        [
          '`<>` - 必填｜`[]` - 可選',
          '',
          '**控制**',
          '```diff',
          '/? 敬請期待！',
          '```',
        ].join('\n'));


    const Previous_button = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel('↼ 上一頁')
      .setStyle('PRIMARY');

    const Next_button = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel('下一頁 ⇀')
      .setStyle('PRIMARY');

    // Create an array of embeds
    pages = [
      embed1,
      embed2,
      embed3,
      embedN,
      // ....
      // embedN
    ];

    // create an array of buttons

    buttonList = [
      Previous_button,
      Next_button,
    ];

    timeout = '120000';

    // Call the paginationEmbed method, first three arguments are required
    // timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
    paginationEmbed(interaction, pages, buttonList, timeout);
    // There you go, now you have paged embeds

  },
};
