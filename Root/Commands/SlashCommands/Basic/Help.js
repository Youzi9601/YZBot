const {
    Client,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const fs = require('fs-extra');

module.exports = {
    command: {
        name: 'help',
        description: '機器人的使用手冊',
    },
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 10000,
    /**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {*} container
 */
    run: async (client, interaction, container) => {
    /*
    await interaction.deferReply();
    let res = new MessageEmbed()
      .setAuthor({
        name: "指令幫助列表",
        url: interaction.client.user.displayAvatarURL({ dynamic: true }),
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
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription("機器人的指令清單")
      .setFooter({
        text: `${interaction.user.tag}・第 ${index + 1}/${pages} 頁`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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
                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription("機器人的指令清單")
              .setFooter({
                text: `${interaction.user.tag}・第 ${index + 1}/${pages} 頁`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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

        /*
// 導入 discordjs-button-pagination 包
const paginationEmbed = require('discordjs-button-pagination');

// 使用 MessageEmbed 製作頁面
// 請記住，嵌入不應設置其頁腳，因為分頁方法在那裡設置頁面信息


const Previous_button = new MessageButton()
  .setCustomId('previousbtn')
  .setLabel('↼ 上一頁')
  .setStyle('PRIMARY');

const Next_button = new MessageButton()
  .setCustomId('nextbtn')
  .setLabel('下一頁 ⇀')
  .setStyle('PRIMARY');

// Create an array of embeds
const pages = [
  basic,
  manage,
  music,
  fun,
  control,
  developers,
  pageN,
  // ....
  // embedN
];

// create an array of buttons

const buttonList = [
  Previous_button,
  Next_button,
];

const timeout = '120000';
*/
        const embed = new MessageEmbed()
            .setAuthor(
                {
                    iconURL: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                    name: `${client.user.username} 幫助介面`,
                })
            .setColor('RANDOM')
            .setDescription('請選擇一個類別！');

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help_menu')
                    .setPlaceholder('請選擇資訊類別')
                    .addOptions([
                        {
                            label: '基本',
                            description: '基本的命令',
                            value: 'normal',
                        },
                        {
                            label: '管理',
                            description: '管理伺服器',
                            value: 'manage',
                        },
                        {
                            label: '音樂',
                            description: '音樂系列命令',
                            value: 'music',
                        },
                        {
                            label: '趣味',
                            description: '好玩的命令',
                            value: 'fun',
                        },
                        {
                            label: '設置功能',
                            description: '設定一些有趣的東西?',
                            value: 'setup',
                        },
                        {
                            label: '控制',
                            description: '控制機器人的活動',
                            value: 'control',
                        },
                        {
                            label: '開發者',
                            description: '開發者所使用的命令',
                            value: 'developers',
                        },
                        {
                            label: '敬請期待！',
                            description: '我們將會有更多的命令喔！',
                            value: 'others',
                        },
                    ]),
            );
        interaction.reply({ embeds: [embed], components: [row] });
        // Call the paginationEmbed method, first three arguments are required
        // timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
        // paginationEmbed(interaction, pages, buttonList, timeout);
        // There you go, now you have paged embeds

    },
};
