const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const moment = require('moment');
const chalk = require('chalk');
const config = require('../../../../Config.js');

module.exports = {
    name: 'list-servers',
    description: '列出所有的伺服器於控制台中',
    ownerOnly: true,
    run: async (client, interaction, container) => {
        client.guilds.cache.forEach((guild) => {
            console.log(
                chalk.gray(
                    `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
                ) +
          chalk.gray('└ ') +
          `${guild.name} | ${guild.id} | 所有者 ${
              guild.ownerId
          } \n                        └ 總共${guild.memberCount}人 | 成員${
              guild.members.cache.filter((m) => !m.user.bot).size
          }人 | 機器人${guild.members.cache.filter((m) => m.user.bot).size}人`,
            );
        });

        // 發送訊息
        const msg = new container.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor({
                name: interaction.member.user.tag,
                iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription('伺服器列表已列於控制台！');
        interaction.reply({
            embeds: [msg],
            allowedMentions: {
                repliedUser: false,
            },
            ephemeral: true,
        });
    },
};
